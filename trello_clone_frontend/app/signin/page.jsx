"use client";
import LoginPage from "@/components/LoginPage";

export default function SigninPage() {
    return (
        <div>
            <main>
                <LoginPage isSignup={false} />
            </main>
        </div>
    )
}