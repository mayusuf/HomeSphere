import ProfileForm from './ProfileForm'

export default function ProfilePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-hs-text">My Profile</h1>
        <p className="text-sm text-muted mt-1">Manage your personal information</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <ProfileForm />
      </div>
    </div>
  )
}
