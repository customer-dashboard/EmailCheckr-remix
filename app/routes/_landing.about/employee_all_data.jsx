import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  return json({ message: "Employee Data Page" });
};

export default function EmployeeDataPage() {
  const data = useLoaderData();
  return (
    <div>
      <h1>Employee All Data</h1>
      <p>{data.message}</p>
    </div>
  );
}
