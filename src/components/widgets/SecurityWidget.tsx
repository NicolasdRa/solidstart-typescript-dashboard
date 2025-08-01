import { createSignal, Show, Index } from 'solid-js'

export default function SecurityWidget() {
  const [showPasswordForm, setShowPasswordForm] = createSignal(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = createSignal(false)
  const [sessions] = createSignal([
    { device: 'Chrome on MacOS', location: 'San Francisco, CA', time: 'Active now', current: true },
    { device: 'Safari on iPhone', location: 'San Francisco, CA', time: '2 hours ago', current: false },
    { device: 'Firefox on Windows', location: 'New York, NY', time: 'Yesterday', current: false }
  ])

  return (
    <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
      <h3 class="text-lg font-semibold text-secondary-900 mb-4">Security</h3>
      
      <div class="space-y-4">
        {/* Password */}
        <div>
          <div class="flex items-center justify-between mb-2">
            <div>
              <h4 class="text-sm font-medium text-secondary-700">Password</h4>
              <p class="text-xs text-secondary-500">Last changed 3 months ago</p>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm())}
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {showPasswordForm() ? 'Cancel' : 'Change'}
            </button>
          </div>
          
          <Show when={showPasswordForm()}>
            <div class="space-y-3 mt-3 p-3 bg-secondary-50 rounded-lg">
              <input
                type="password"
                placeholder="Current password"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <input
                type="password"
                placeholder="New password"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button class="w-full px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors duration-200">
                Update Password
              </button>
            </div>
          </Show>
        </div>

        {/* Two-factor authentication */}
        <div class="flex items-center justify-between py-3 border-t border-secondary-100">
          <div>
            <h4 class="text-sm font-medium text-secondary-700">Two-factor authentication</h4>
            <p class="text-xs text-secondary-500">{twoFactorEnabled() ? 'Enabled' : 'Not enabled'}</p>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled())}
            class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              twoFactorEnabled() ? 'bg-primary-600' : 'bg-secondary-300'
            }`}
          >
            <span
              class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                twoFactorEnabled() ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Active sessions */}
        <div class="pt-3 border-t border-secondary-100">
          <h4 class="text-sm font-medium text-secondary-700 mb-3">Active sessions</h4>
          <div class="space-y-2">
            <Index each={sessions()}>
              {(session) => (
                <div class="flex items-center justify-between py-2">
                  <div class="flex-1">
                    <p class="text-sm text-secondary-900">{session().device}</p>
                    <p class="text-xs text-secondary-500">{session().location} · {session().time}</p>
                  </div>
                  <Show when={!session().current}>
                    <button class="text-xs text-red-600 hover:text-red-700 font-medium">
                      Revoke
                    </button>
                  </Show>
                </div>
              )}
            </Index>
          </div>
        </div>

        <button class="w-full px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200">
          Sign out all devices
        </button>
      </div>
    </div>
  )
}