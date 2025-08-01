import ProfileInfoWidget from '~/components/widgets/ProfileInfoWidget/ProfileInfoWidget'
import AccountSettingsWidget from '~/components/widgets/AccountSettingsWidget/AccountSettingsWidget'
import PreferencesWidget from '~/components/widgets/PreferencesWidget/PreferencesWidget'
import SecurityWidget from '~/components/widgets/SecurityWidget/SecurityWidget'
import styles from './ProfileContent.module.css'

export default function ProfileContent() {
  return (
    <div class={styles.grid}>
      <div class={styles.profileInfoContainer}>
        <ProfileInfoWidget />
      </div>
      <AccountSettingsWidget />
      <PreferencesWidget />
      <SecurityWidget />
    </div>
  )
}