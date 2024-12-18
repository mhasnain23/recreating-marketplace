// import { fetchUserAction } from "@/actions";
import SignUpForm from "@/components/SignUpForm";
// import { redirect } from "next/navigation";

const UnAuthPage = async () => {
  // const userInfo = await fetchUserAction();
  // if (userInfo.success) redirect("/");

  return (
    <div>
      <SignUpForm />
    </div>
  );
};

export default UnAuthPage;
