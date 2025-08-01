import { createSignal } from 'solid-js'

export default function ProfileInfoWidget() {
  const [isEditing, setIsEditing] = createSignal(false)
  const [profileData, setProfileData] = createSignal({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software developer passionate about creating amazing user experiences.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev'
  })

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, save to backend
    console.log('Profile saved:', profileData())
  }

  return (
    <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-secondary-900">Profile Information</h3>
        {!isEditing() ? (
          <button
            onClick={() => setIsEditing(true)}
            class="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            Edit Profile
          </button>
        ) : (
          <div class="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              class="px-4 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              class="px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        {/* Profile Avatar */}
        <div class="flex-shrink-0">
          <div class="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {profileData().name.split(' ').map(n => n[0]).join('')}
          </div>
          {isEditing() && (
            <button class="mt-4 w-full px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200">
              Change Avatar
            </button>
          )}
        </div>

        {/* Profile Details */}
        <div class="flex-1 space-y-4">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">Name</label>
            {isEditing() ? (
              <input
                type="text"
                value={profileData().name}
                onInput={(e) => setProfileData(prev => ({ ...prev, name: e.currentTarget.value }))}
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p class="text-secondary-900">{profileData().name}</p>
            )}
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">Email</label>
            {isEditing() ? (
              <input
                type="email"
                value={profileData().email}
                onInput={(e) => setProfileData(prev => ({ ...prev, email: e.currentTarget.value }))}
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p class="text-secondary-900">{profileData().email}</p>
            )}
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">Bio</label>
            {isEditing() ? (
              <textarea
                value={profileData().bio}
                onInput={(e) => setProfileData(prev => ({ ...prev, bio: e.currentTarget.value }))}
                rows={3}
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            ) : (
              <p class="text-secondary-900">{profileData().bio}</p>
            )}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">Location</label>
              {isEditing() ? (
                <input
                  type="text"
                  value={profileData().location}
                  onInput={(e) => setProfileData(prev => ({ ...prev, location: e.currentTarget.value }))}
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p class="text-secondary-900">{profileData().location}</p>
              )}
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">Website</label>
              {isEditing() ? (
                <input
                  type="url"
                  value={profileData().website}
                  onInput={(e) => setProfileData(prev => ({ ...prev, website: e.currentTarget.value }))}
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <a href={profileData().website} class="text-primary-600 hover:text-primary-700">
                  {profileData().website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}