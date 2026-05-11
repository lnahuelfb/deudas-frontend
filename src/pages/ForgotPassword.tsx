import ForgotPasswordForm from "@features/auth/components/ForgotPasswordForm";

function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-violet-950 to-violet-800 text-white">
      <ForgotPasswordForm />
    </div>
  );
}

export default ForgotPassword;
