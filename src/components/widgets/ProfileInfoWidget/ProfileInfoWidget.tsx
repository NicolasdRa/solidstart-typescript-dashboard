import { createSignal, createMemo, Show, createEffect } from 'solid-js'
import { useAppStore } from '~/stores/appStore'
import { updateProfileInfo } from '~/api'
import { useSubmission } from '@solidjs/router'
import styles from './ProfileInfoWidget.module.css'

export default function ProfileInfoWidget() {
  const { state, actions } = useAppStore()
  const [isEditing, setIsEditing] = createSignal(false)
  const updating = useSubmission(updateProfileInfo)
  
  // Create memos for profile data with placeholders
  const profileData = createMemo(() => ({
    name: state.user?.name || '',
    email: state.user?.email || '',
    bio: state.user?.bio || '',
    location: state.user?.location || '',
    website: state.user?.website || ''
  }))

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  // Handle successful form submission
  createEffect(() => {
    if (updating.result && !updating.pending) {
      if (updating.result.success) {
        setIsEditing(false)
        // Force refresh user data - in a real app you'd update the store
        window.location.reload()
      }
    }
  })

  return (
    <div class={styles.container}>
      <div class={styles.header}>
        <h3 class={styles.title}>Profile Information</h3>
        {!isEditing() ? (
          <button
            onClick={handleEdit}
            class={styles.editButton}
          >
            Edit Profile
          </button>
        ) : (
          <div class={styles.actionButtons}>
            <button
              onClick={handleCancel}
              class={styles.cancelButton}
              disabled={updating.pending}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="profile-form"
              class={styles.saveButton}
              disabled={updating.pending}
            >
              {updating.pending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div class={styles.profileContent}>
        {/* Profile Avatar */}
        <div class={styles.avatarSection}>
          <div class={styles.avatar}>
            {profileData().name 
              ? profileData().name.split(' ').map(n => n[0]).join('').toUpperCase()
              : state.user?.username?.substring(0, 2).toUpperCase() || '??'
            }
          </div>
          {isEditing() && (
            <button class={styles.avatarButton}>
              Change Avatar
            </button>
          )}
        </div>

        {/* Profile Details */}
        <Show 
          when={isEditing()}
          fallback={
            <div class={styles.profileDetails}>
              <div class={styles.fieldGroup}>
                <label class={styles.fieldLabel}>Name</label>
                <p class={styles.fieldValue}>
                  {profileData().name || <span class={styles.placeholder}>No name provided</span>}
                </p>
              </div>

              <div class={styles.fieldGroup}>
                <label class={styles.fieldLabel}>Email</label>
                <p class={styles.fieldValue}>
                  {profileData().email || <span class={styles.placeholder}>No email provided</span>}
                </p>
              </div>

              <div class={styles.fieldGroup}>
                <label class={styles.fieldLabel}>Bio</label>
                <p class={styles.fieldValue}>
                  {profileData().bio || <span class={styles.placeholder}>No bio provided</span>}
                </p>
              </div>

              <div class={styles.fieldGrid}>
                <div class={styles.fieldGroup}>
                  <label class={styles.fieldLabel}>Location</label>
                  <p class={styles.fieldValue}>
                    {profileData().location || <span class={styles.placeholder}>No location provided</span>}
                  </p>
                </div>
                <div class={styles.fieldGroup}>
                  <label class={styles.fieldLabel}>Website</label>
                  <Show 
                    when={profileData().website}
                    fallback={<span class={styles.placeholder}>No website provided</span>}
                  >
                    <a href={profileData().website} class={styles.fieldLink} target="_blank" rel="noopener noreferrer">
                      {profileData().website}
                    </a>
                  </Show>
                </div>
              </div>
            </div>
          }
        >
          <form id="profile-form" action={updateProfileInfo} method="post" class={styles.profileDetails}>
            <div class={styles.fieldGroup}>
              <label class={styles.fieldLabel}>Name</label>
              <input
                name="name"
                type="text"
                value={profileData().name}
                placeholder="Enter your full name"
                class={styles.fieldInput}
              />
            </div>

            <div class={styles.fieldGroup}>
              <label class={styles.fieldLabel}>Email</label>
              <input
                name="email"
                type="email"
                value={profileData().email}
                placeholder="Enter your email address"
                class={styles.fieldInput}
              />
            </div>

            <div class={styles.fieldGroup}>
              <label class={styles.fieldLabel}>Bio</label>
              <textarea
                name="bio"
                value={profileData().bio}
                placeholder="Tell us about yourself..."
                rows={3}
                class={styles.fieldTextarea}
              />
            </div>

            <div class={styles.fieldGrid}>
              <div class={styles.fieldGroup}>
                <label class={styles.fieldLabel}>Location</label>
                <input
                  name="location"
                  type="text"
                  value={profileData().location}
                  placeholder="City, Country"
                  class={styles.fieldInput}
                />
              </div>
              <div class={styles.fieldGroup}>
                <label class={styles.fieldLabel}>Website</label>
                <input
                  name="website"
                  type="url"
                  value={profileData().website}
                  placeholder="https://yourwebsite.com"
                  class={styles.fieldInput}
                />
              </div>
            </div>
          </form>
        </Show>
      </div>
    </div>
  )
}