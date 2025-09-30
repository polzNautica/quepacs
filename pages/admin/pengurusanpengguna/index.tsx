import AdminLayout from '@/layouts/admin'
import Link from 'next/link'
import React from 'react'

const PengurusanPengguna = () => {
  return (
    <AdminLayout>
      <div>PengurusanPengguna</div>
      <Link href="/admin/pengurusanpengguna/usertest">User Test</Link>
    </AdminLayout>
  )
}

export default PengurusanPengguna