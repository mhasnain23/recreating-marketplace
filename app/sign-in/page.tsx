import { fetchUserAction } from "@/actions";
import SignInForm from "@/components/SignInForm";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const userInfo = await fetchUserAction();
  if (userInfo.success) redirect("/");

  return (
    <div>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
