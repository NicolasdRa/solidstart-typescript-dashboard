import ProfileInfoWidget from '~/components/widgets/ProfileInfoWidget'
import AccountSettingsWidget from '~/components/widgets/AccountSettingsWidget'
import PreferencesWidget from '~/components/widgets/PreferencesWidget'
import SecurityWidget from '~/components/widgets/SecurityWidget'

export default function ProfileController() {
  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 pb-5">
      <div class="col-span-1 lg:col-span-2 xl:col-span-3">
        <ProfileInfoWidget />
      </div>
      <AccountSettingsWidget />
      <PreferencesWidget />
      <SecurityWidget />
    </div>
  )
}