import {
  useSubmission,
  type RouteSectionProps
} from "@solidjs/router";
import { Show, createSignal, createMemo } from "solid-js";
import { loginOrRegister } from "~/api";
import SEO from "~/components/SEO/SEO";
import styles from "./login.module.css";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);
  const [loginType, setLoginType] = createSignal<"login" | "register">("login");

  const isLoading = createMemo(() => loggingIn.pending);
  const buttonText = createMemo(() => {
    if (isLoading()) {
      return loginType() === "login" ? "Signing in..." : "Creating account...";
    }
    return loginType() === "login" ? "Sign In" : "Create Account";
  });

  const handleSubmit = (e: Event) => {
    // Form validation could be added here
  };

  return (
    <>
      <SEO 
        title={loginType() === "login" ? "Sign In" : "Create Account"}
        description="Access your dashboard by signing in or creating a new account."
        path="/login"
      />
      
      <main class={styles.container}>
        <div class={styles.loginCard}>
          {/* Header */}
          <div class={styles.header}>
            <h1 class={styles.title}>
              {loginType() === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p class={styles.subtitle}>
              {loginType() === "login" 
                ? "Sign in to access your dashboard" 
                : "Join us and start building your dashboard"
              }
            </p>
          </div>

          {/* Login Form */}
          <form action={loginOrRegister} method="post" class={styles.form} onSubmit={handleSubmit}>
            <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
            <input type="hidden" name="loginType" value={loginType()} />
            
            {/* Login Type Toggle */}
            <div class={styles.loginTypeToggle}>
              <label class={styles.toggleOption}>
                <input 
                  type="radio" 
                  name="loginTypeToggle" 
                  value="login" 
                  checked={loginType() === "login"}
                  onChange={() => setLoginType("login")}
                />
                <span class={styles.toggleLabel}>Sign In</span>
              </label>
              <label class={styles.toggleOption}>
                <input 
                  type="radio" 
                  name="loginTypeToggle" 
                  value="register" 
                  checked={loginType() === "register"}
                  onChange={() => setLoginType("register")}
                />
                <span class={styles.toggleLabel}>Sign Up</span>
              </label>
            </div>

            {/* Username Field */}
            <div class={styles.formGroup}>
              <label for="username-input" class={styles.label}>
                Username
              </label>
              <input 
                id="username-input"
                name="username" 
                type="text"
                placeholder="Enter your username"
                autocomplete="username"
                required
                class={styles.input}
                disabled={isLoading()}
              />
            </div>

            {/* Password Field */}
            <div class={styles.formGroup}>
              <label for="password-input" class={styles.label}>
                Password
              </label>
              <input 
                id="password-input"
                name="password" 
                type="password"
                placeholder="Enter your password"
                autocomplete={loginType() === "login" ? "current-password" : "new-password"}
                required
                class={styles.input}
                disabled={isLoading()}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              class={styles.submitButton}
              disabled={isLoading()}
            >
              <Show 
                when={isLoading()} 
                fallback={buttonText()}
              >
                <span class={styles.loading}>
                  <span class={styles.spinner}></span>
                  {buttonText()}
                </span>
              </Show>
            </button>

            {/* Error Message */}
            <Show when={loggingIn.result}>
              <div class={styles.errorMessage} role="alert" id="error-message">
                <svg class={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
                {loggingIn.result!.message}
              </div>
            </Show>
          </form>
        </div>
      </main>
    </>
  );
}
