import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../utils/api';
import { Ticket, TicketSale } from '../../types';
import { Ticket as TicketIcon, Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react';

export function TicketPurchasePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await api.getTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (ticketId: string, delta: number) => {
    setCart(prev => {
      const current = prev[ticketId] || 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        [ticketId]: next
      };
    });
  };

  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const ticket = tickets.find(t => t.id === id);
    return sum + (ticket?.price || 0) * qty;
  }, 0);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const visitorName = `${checkoutData.firstName} ${checkoutData.lastName}`;
      const date = new Date().toISOString().split('T')[0];

      // Create a sale for each ticket type in the cart
      const salePromises = Object.entries(cart)
        .filter(([_, qty]) => qty > 0)
        .map(async ([ticketId, qty]) => {
          const ticket = tickets.find(t => t.id === ticketId);
          if (!ticket) return null;

          const saleData: Partial<TicketSale> = {
            id: `sale-${Date.now()}-${ticketId}`,
            ticketId: ticketId,
            quantity: qty,
            totalAmount: ticket.price * qty,
            date: date,
            visitorName: visitorName,
            visitorEmail: checkoutData.email,
            visitorPhone: checkoutData.phone
          };

          return api.createTicketSale(saleData);
        });

      await Promise.all(salePromises);

      setIsProcessing(false);
      setOrderComplete(true);
      setCart({});

      setTimeout(() => {
        setShowCheckout(false);
        setOrderComplete(false);
        setCheckoutData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          billingAddress: ''
        });
      }, 5000);
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
      alert('Failed to process order. Please try again.');
    }
  };

  const closeCheckout = () => {
    setShowCheckout(false);
    setOrderComplete(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-2xl font-black uppercase tracking-tighter italic">Loading Adventure...</div>
    </div>;
  }
  return <div className="min-h-screen bg-white">
    <nav className="border-b-4 border-black py-4 px-4 bg-[#2563EB]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-black overflow-hidden group-hover:scale-110 transition-transform">
            <img src="/logo.png" alt="Zootopia Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black text-white uppercase tracking-tighter">
            Zootopia Tickets
          </span>
        </Link>
        <div className="flex items-center gap-2 bg-white px-4 py-2 border-2 border-black font-bold">
          <ShoppingCart className="w-5 h-5" />
          <span>{totalItems} items</span>
          <span className="mx-2">|</span>
          <span>${totalAmount}</span>
        </div>
      </div>
    </nav>

    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black uppercase mb-4">
          Get Your Tickets
        </h1>
        <p className="text-xl font-bold text-gray-600">
          Choose your adventure pass below
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {tickets.map(ticket => <Card key={ticket.id} className="flex flex-col h-full hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow">
          <div className="flex-1">
            <div className="w-12 h-12 bg-[#FBBF24] rounded-full flex items-center justify-center border-2 border-black mb-4">
              <TicketIcon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black uppercase mb-2">
              {ticket.type}
            </h3>
            <p className="text-gray-600 font-medium mb-4">
              {ticket.description}
            </p>
            <div className="text-4xl font-black mb-6">${ticket.price}</div>
          </div>

          <div className="flex items-center justify-between bg-gray-100 p-2 border-2 border-black">
            <button onClick={() => updateQuantity(ticket.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black hover:bg-gray-100 active:translate-y-1 transition-all" disabled={!cart[ticket.id]}>
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-black">
              {cart[ticket.id] || 0}
            </span>
            <button onClick={() => updateQuantity(ticket.id, 1)} className="w-8 h-8 flex items-center justify-center bg-[#10B981] border-2 border-black hover:bg-[#059669] active:translate-y-1 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </Card>)}
      </div>

      <div className="flex justify-center">
        <Button onClick={handleCheckout} className="text-2xl px-12 py-6" disabled={totalItems === 0}>
          Proceed to Checkout (${totalAmount})
        </Button>
      </div>
    </div>

    <Modal
      isOpen={showCheckout}
      onClose={closeCheckout}
      title={orderComplete ? 'Order Complete!' : 'Checkout'}
    >
      {orderComplete ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-black mb-2">Payment Successful!</h4>
          <p className="text-gray-600 font-medium mb-4">
            Your tickets have been purchased successfully. You will receive a confirmation email shortly.
          </p>
          <div className="bg-[#FBBF24] p-4 border-2 border-black">
            <p className="font-black">Order Total: ${totalAmount}</p>
            <p className="text-sm font-bold">Confirmation #: ZOO-{Date.now()}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 border-2 border-black">
            <h4 className="font-black mb-3">Order Summary</h4>
            {Object.entries(cart).map(([id, qty]) => {
              const ticket = tickets.find(t => t.id === id);
              if (!ticket || qty === 0) return null;
              return (
                <div key={id} className="flex justify-between items-center mb-2">
                  <span className="font-medium">{ticket.type} x {qty}</span>
                  <span className="font-bold">${(ticket.price * qty).toFixed(2)}</span>
                </div>
              );
            })}
            <div className="border-t-2 border-black pt-2 mt-2">
              <div className="flex justify-between items-center font-black text-lg">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={checkoutData.firstName}
                onChange={(e) => setCheckoutData({ ...checkoutData, firstName: e.target.value })}
                required
              />
              <Input
                label="Last Name"
                value={checkoutData.lastName}
                onChange={(e) => setCheckoutData({ ...checkoutData, lastName: e.target.value })}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={checkoutData.email}
              onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
              required
            />

            <Input
              label="Phone"
              type="tel"
              value={checkoutData.phone}
              onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
              required
            />

            <Input
              label="Card Number"
              value={checkoutData.cardNumber}
              onChange={(e) => setCheckoutData({ ...checkoutData, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                value={checkoutData.expiryDate}
                onChange={(e) => setCheckoutData({ ...checkoutData, expiryDate: e.target.value })}
                placeholder="MM/YY"
                required
              />
              <Input
                label="CVV"
                value={checkoutData.cvv}
                onChange={(e) => setCheckoutData({ ...checkoutData, cvv: e.target.value })}
                placeholder="123"
                required
              />
            </div>

            <Input
              label="Billing Address"
              textarea
              value={checkoutData.billingAddress}
              onChange={(e) => setCheckoutData({ ...checkoutData, billingAddress: e.target.value })}
              placeholder="123 Main St, City, State, ZIP"
              required
            />

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#10B981] text-black py-4 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing Payment...' : `Complete Purchase - $${totalAmount.toFixed(2)}`}
            </button>
          </form>
        </>
      )}
    </Modal>
  </div>;
}