import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    booking_date: '',
    complaint: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([formData])

      if (error) throw error

      alert('Pendaftaran berhasil! Admin akan segera menghubungi Anda.')
      setFormData({ name: '', phone: '', booking_date: '', complaint: '' })
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Jadwal Bekam Sunnah</h1>
        <p>Sehat dengan terapi sesuai sunnah Nabi</p>
        <Link to="/login" style={{ fontSize: '0.9rem', color: '#166534', textDecoration: 'none' }}>Login Admin</Link>
      </header>

      <main className="main-content" style={{ gridTemplateColumns: '1fr' }}>
        <section className="card form-section" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2><Calendar className="icon" /> Buat Janji Baru</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><User className="icon-small" /> Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Masukkan nama Anda"
              />
            </div>

            <div className="form-group">
              <label><Phone className="icon-small" /> Nomor WhatsApp</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Contoh: 08123456789"
              />
            </div>

            <div className="form-group">
              <label><Clock className="icon-small" /> Tanggal Terapi</label>
              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label><FileText className="icon-small" /> Keluhan (Opsional)</label>
              <textarea
                name="complaint"
                value={formData.complaint}
                onChange={handleChange}
                placeholder="Jelaskan keluhan kesehatan Anda..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Mengirim...' : 'Daftar Sekarang'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
