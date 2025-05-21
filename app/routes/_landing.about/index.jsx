import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EmployeeProfileCard from "./employee-profile-card";
import { getEmployeeData } from "./get-employee-data.server";

export const loader = async () => {
  const employees = await getEmployeeData();
  return json({ employees });
};

export default function AboutPage() {
  const { employees } = useLoaderData();

  return (
    <main>
      <h1>Meet Our Team</h1>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {employees.map((emp, index) => (
          <EmployeeProfileCard key={index} employee={emp} />
        ))}
      </div>
    </main>
  );
}
