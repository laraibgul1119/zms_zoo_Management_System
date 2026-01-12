import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/ui/Navbar';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../utils/api';
import { ZooEvent } from '../../types';
import { Plus, Edit, Calendar, MapPin } from 'lucide-react';

export function EventManagementPage() {
  const [events, setEvents] = useState<ZooEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ZooEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    status: 'Upcoming' as 'Upcoming' | 'Completed' | 'Cancelled'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage({ type: 'error', text: 'Failed to load events' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: '',
      status: 'Upcoming'
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditEvent = (event: ZooEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time,
      location: event.location,
      capacity: event.capacity.toString(),
      status: event.status
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const eventData: Partial<ZooEvent> = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      capacity: parseInt(formData.capacity) || 50,
      registeredCount: editingEvent ? editingEvent.registeredCount : 0,
      status: formData.status
    };

    try {
      if (editingEvent) {
        await api.updateEvent(editingEvent.id, eventData);
        setMessage({ type: 'success', text: 'Event updated successfully!' });
      } else {
        const newEvent = {
          ...eventData,
          id: `event-${Date.now()}`
        };
        await api.createEvent(newEvent);
        setMessage({ type: 'success', text: 'Event created successfully!' });
      }
      fetchEvents();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      setMessage({ type: 'error', text: 'Failed to save event' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingEvent(null);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
      <div className="text-2xl font-black uppercase">Loading events...</div>
    </div>;
  }
  return <div className="min-h-screen bg-[#F3F4F6]">
    <Navbar />
    <main className="max-w-[1920px] mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase mb-2">
            Event Management
          </h1>
          <p className="text-gray-600 font-bold">
            Schedule shows, feedings, and tours
          </p>
        </div>
        <Button onClick={handleCreateEvent}>
          <Plus className="w-5 h-5" /> Create Event
        </Button>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`mb-6 p-4 border-2 border-black font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <Card>
        <Table data={events} keyField="id" columns={[{
          header: 'Event Name',
          accessor: 'title'
        }, {
          header: 'Date & Time',
          accessor: e => <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {e.date} at {e.time}
          </div>
        }, {
          header: 'Location',
          accessor: e => <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {e.location}
          </div>
        }, {
          header: 'Registrations',
          accessor: e => `${e.registeredCount} / ${e.capacity}`
        }, {
          header: 'Status',
          accessor: e => <Badge variant={e.status === 'Upcoming' ? 'success' : 'neutral'}>
            {e.status}
          </Badge>
        }]} actions={(event: ZooEvent) => <button onClick={() => handleEditEvent(event)} className="p-2 border-2 border-black hover:bg-gray-100">
          <Edit className="w-4 h-4" />
        </button>} />
      </Card>
    </main>

    <Modal
      isOpen={showCreateModal}
      onClose={closeModal}
      title={editingEvent ? 'Edit Event' : 'Create New Event'}
    >
      {message.text && (
        <div className={`mb-4 p-3 border-2 border-black ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Event Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Lion Feeding Show"
          required
        />

        <Input
          label="Description"
          textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the event..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <Input
            label="Time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>

        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Lion Habitat"
          required
        />

        <Input
          label="Capacity"
          type="number"
          min="1"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          placeholder="50"
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Upcoming' | 'Completed' | 'Cancelled' })}
          options={[
            { value: 'Upcoming', label: 'Upcoming' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Cancelled', label: 'Cancelled' }
          ]}
        />

        <button
          type="submit"
          className="w-full bg-[#10B981] text-black py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {editingEvent ? 'UPDATE EVENT' : 'CREATE EVENT'}
        </button>
      </form>
    </Modal>
  </div>;
}