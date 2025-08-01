import { createSignal } from 'solid-js'
import styles from './ProfileInfoWidget.module.css'

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
    <div class={styles.container}>
      <div class={styles.header}>
        <h3 class={styles.title}>Profile Information</h3>
        {!isEditing() ? (
          <button
            onClick={() => setIsEditing(true)}
            class={styles.editButton}
          >
            Edit Profile
          </button>
        ) : (
          <div class={styles.actionButtons}>
            <button
              onClick={() => setIsEditing(false)}
              class={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              class={styles.saveButton}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div class={styles.profileContent}>
        {/* Profile Avatar */}
        <div class={styles.avatarSection}>
          <div class={styles.avatar}>
            {profileData().name.split(' ').map(n => n[0]).join('')}
          </div>
          {isEditing() && (
            <button class={styles.avatarButton}>
              Change Avatar
            </button>
          )}
        </div>

        {/* Profile Details */}
        <div class={styles.profileDetails}>
          <div class={styles.fieldGroup}>
            <label class={styles.fieldLabel}>Name</label>
            {isEditing() ? (
              <input
                type="text"
                value={profileData().name}
                onInput={(e) => setProfileData(prev => ({ ...prev, name: e.currentTarget.value }))}
                class={styles.fieldInput}
              />
            ) : (
              <p class={styles.fieldValue}>{profileData().name}</p>
            )}
          </div>

          <div class={styles.fieldGroup}>
            <label class={styles.fieldLabel}>Email</label>
            {isEditing() ? (
              <input
                type="email"
                value={profileData().email}
                onInput={(e) => setProfileData(prev => ({ ...prev, email: e.currentTarget.value }))}
                class={styles.fieldInput}
              />
            ) : (
              <p class={styles.fieldValue}>{profileData().email}</p>
            )}
          </div>

          <div class={styles.fieldGroup}>
            <label class={styles.fieldLabel}>Bio</label>
            {isEditing() ? (
              <textarea
                value={profileData().bio}
                onInput={(e) => setProfileData(prev => ({ ...prev, bio: e.currentTarget.value }))}
                rows={3}
                class={styles.fieldTextarea}
              />
            ) : (
              <p class={styles.fieldValue}>{profileData().bio}</p>
            )}
          </div>

          <div class={styles.fieldGrid}>
            <div class={styles.fieldGroup}>
              <label class={styles.fieldLabel}>Location</label>
              {isEditing() ? (
                <input
                  type="text"
                  value={profileData().location}
                  onInput={(e) => setProfileData(prev => ({ ...prev, location: e.currentTarget.value }))}
                  class={styles.fieldInput}
                />
              ) : (
                <p class={styles.fieldValue}>{profileData().location}</p>
              )}
            </div>
            <div class={styles.fieldGroup}>
              <label class={styles.fieldLabel}>Website</label>
              {isEditing() ? (
                <input
                  type="url"
                  value={profileData().website}
                  onInput={(e) => setProfileData(prev => ({ ...prev, website: e.currentTarget.value }))}
                  class={styles.fieldInput}
                />
              ) : (
                <a href={profileData().website} class={styles.fieldLink}>
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