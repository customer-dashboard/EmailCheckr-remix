export default function EmployeeProfileCard({ employee }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
      <img src={employee.photoUrl} alt={`${employee.name}'s photo`} width={100} height={100} />
      <h3>{employee.name}</h3>
      <p>{employee.role}</p>
    </div>
  );
}
