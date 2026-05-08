import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [showCreateResume, setShowCreateResume] = useState(true);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const createResume = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/resumes/create", { title });
      navigate(`/resume-builder/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // auto-open popup on page load
  useEffect(() => {
    setShowCreateResume(true);
  }, []);


  const handleXClick = () => {
    navigate("/resume-analyzer");
  }

  return (
    <>
      {showCreateResume && (
        <form
          onSubmit={createResume}
          className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-lg w-full max-w-sm p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              Create Your Resume
            </h2>

            <input
              type="text"
              placeholder="Enter resume title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded mb-4 focus:ring-2 focus:ring-indigo-500"
            />

            <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Create Resume
            </button>

            <XIcon
              onClick={handleXClick}
              className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
            />
          </div>
        </form>
      )}
    </>
  );
};

export default Dashboard;
