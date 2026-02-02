import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { LogOut, CheckCircle, XCircle, Trash2 } from 'lucide-react'

export default function Admin() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
    }
  }

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true })
    
    if (error) console.error('Error fetching bookings:', error)
    else setBookings(data || [])
    setLoading(false)
  }

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) alert('Gagal update status')
    else fetchBookings()
  }

  const deleteBooking = async (id) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) alert('Gagal menghapus')
    else fetchBookings()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard Admin</h1>
        <button onClick={handleLogout} className="btn-primary" style={{ width: 'auto', backgroundColor: '#dc2626' }}>
          <LogOut className="icon-small" /> Logout
        </button>
      </header>

      <div className="card list-section">
        <h2>Daftar Pasien Masuk</h2>
        {bookings.length === 0 ? (
          <p className="empty-state">Belum ada data pendaftaran.</p>
        ) : (
          <ul className="booking-list">
            {bookings.map((booking) => (
              <li key={booking.id} className="booking-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <div className="booking-date">
                    {new Date(booking.booking_date).toLocaleDateString('id-ID', {
                      weekday: 'long', day: 'numeric', month: 'long'
                    })}
                  </div>
                  <span className={`status ${booking.status}`}>{booking.status}</span>
                </div>
                
                <div className="booking-info" style={{ textAlign: 'left', width: '100%' }}>
                  <strong>{booking.name}</strong> - {booking.phone}
                  <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
                    Keluhan: {booking.complaint || '-'}
                  </p>
                </div>

                <div className="actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button 
                    onClick={() => updateStatus(booking.id, 'confirmed')}
                    style={{ padding: '0.5rem', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    title="Konfirmasi"
                  >
                    <CheckCircle size={18} /> Konfirmasi
                  </button>
                  <button 
                    onClick={() => updateStatus(booking.id, 'completed')}
                    style={{ padding: '0.5rem', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    title="Selesai"
                  >
                    <CheckCircle size={18} /> Selesai
                  </button>
                  <button 
                    onClick={() => deleteBooking(booking.id)}
                    style={{ padding: '0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
