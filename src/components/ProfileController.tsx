import ProfileInfoWidget from '~/components/widgets/ProfileInfoWidget'
import AccountSettingsWidget from '~/components/widgets/AccountSettingsWidget'
import PreferencesWidget from '~/components/widgets/PreferencesWidget'
import SecurityWidget from '~/components/widgets/SecurityWidget'
import styles from './ProfileController.module.css'

export default function ProfileController() {
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