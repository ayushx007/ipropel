export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to MCQ Website</h1>
      <p>
        Navigate to <a href="/instructor" className="text-blue-500">Instructor</a> or <a href="/learner" className="text-blue-500">Learner</a> to get started.
      </p>
    </div>
  );
}
