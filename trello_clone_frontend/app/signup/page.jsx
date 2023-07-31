"use client";
import LoginPage from "@/components/LoginPage";

export default function SignupPage() {
    return (
        <div>
            <main>
                <LoginPage isSignup={true} />
            </main>
        </div>
    )
}