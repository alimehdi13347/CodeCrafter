import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { FaCode } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import { IoIosCopy } from "react-icons/io";
import { PiExportFill } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { MdOutlineRefresh } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { GoogleGenAI } from "@google/genai";

const options = [
  { value: "html-css", label: "HTML + CSS" },
  { value: "html-tailwind", label: "HTML + Tailwind CSS" },
  { value: "html-bootstrap", label: "HTML + Bootstrap" },
  { value: "html-css-js", label: "HTML + CSS + JS" },
  { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#0f0f0f",
    color: "#fff",
    border: "1px solid #3b3b3b",
    borderRadius: "12px",
    padding: "4px",
    boxShadow: "0 0 10px rgba(139, 92, 246, 0.2)",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#2a2a2a" : "#1a1a1a",
    color: "#fff",
  }),
  input: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#aaa",
  }),
};

const Home = () => {
  const [output, showOutput] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullpreview, setFullpreview] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const extractCode = (response) => {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("✨ Code copied to clipboard!");
    } catch {
      toast.error("⚠️ Unable to copy code");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "component.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("📂 File downloaded");
  };

  async function getResponse() {
    if (!prompt.trim()) {
      toast.error("Please describe your component first!");
      return;
    }

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are a web developer. Create a modern, animated UI for:
${prompt}.
Framework: ${framework.label}.
Return only full HTML code in markdown format.`,
      });

      setCode(extractCode(response.text));
      showOutput(true);
    } catch {
      toast.error("⚠️ Something went wrong, try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex gap-10 px-[100px] mt-10 items-start text-white">
        {/* LEFT PANEL */}
        <div className="w-[50%] bg-[#121212] p-8 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.15)] border border-[#2b2b2b] transition-all duration-300 ">
          <h2 className="text-[24px] font-semibold mb-2 flex items-center gap-2">
            ⚡ AI Component Generator
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Describe your idea, and watch AI turn it into real HTML code.
          </p>

          <label className="block text-[15px] font-medium mb-2">
            Select Framework
          </label>
          <Select
            options={options}
            styles={customStyles}
            defaultValue={framework}
            onChange={(selected) => setFramework(selected)}
            className="mb-6 w-[80%]"
          />

          <label className="block text-[15px] font-medium mb-2">
            Describe Your Component
          </label>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A responsive pricing table with hover animations"
            className="bg-[#1a1a1a] text-white w-full h-[220px] p-4 rounded-lg border border-[#333] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none placeholder:text-gray-500"
          ></textarea>

          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-500 text-sm">
              Click “Generate” to see magic happen ✨
            </p>
            <button
              disabled={loading}
              onClick={getResponse}
              className="border-none px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-sm shadow-md hover:scale-105 transition-all flex items-center gap-2"
            >
              {loading ? (
                <ClipLoader color="#fff" size={20} />
              ) : (
                <BsStars className="text-lg" />
              )}
              Generate
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[50%] h-[80vh] bg-[#121212] p-6 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.15)] border border-[#2b2b2b] relative">
          {!output ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <div className="h-[70px] w-[70px] bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center rounded-full text-3xl text-white shadow-lg animate-pulse">
                <FaCode />
              </div>
              <p>Your generated code will appear here...</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex justify-center mb-5">
                <button
                  onClick={() => setTab(1)}
                  className={`w-[50%] py-2 rounded-l-lg font-medium ${
                    tab === 1
                      ? "bg-purple-700 text-white"
                      : "bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a]"
                  }`}
                >
                  💻 Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`w-[50%] py-2 rounded-r-lg font-medium ${
                    tab === 2
                      ? "bg-purple-700 text-white"
                      : "bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a]"
                  }`}
                >
                  🌐 Preview
                </button>
              </div>

              {tab === 1 ? (
                <>
                  <div className="flex justify-between mb-3 px-2">
                    <h2 className="text-white font-semibold text-lg">
                      Code Editor
                    </h2>
                    <div className="flex gap-5 text-xl text-white">
                      <IoIosCopy
                        onClick={copyCode}
                        className="cursor-pointer hover:text-purple-400 transition"
                      />
                      <PiExportFill
                        onClick={handleDownload}
                        className="cursor-pointer hover:text-purple-400 transition"
                      />
                    </div>
                  </div>
                  <Editor
                    height="60vh"
                    theme="vs-dark"
                    defaultLanguage="html"
                    value={code}
                  />
                </>
              ) : (
                <>
                  <div className="flex justify-between mb-3 px-2 text-white">
                    <h2 className="font-semibold text-lg">Live Preview</h2>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setFullpreview(true)}
                        className="flex items-center gap-1 hover:text-purple-400 transition"
                      >
                        <ImNewTab /> New Tab
                      </button>
                      <button
                        onClick={() => setRefreshKey((p) => p + 1)}
                        className="flex items-center gap-1 hover:text-purple-400 transition"
                      >
                        <MdOutlineRefresh /> Refresh
                      </button>
                    </div>
                  </div>
                  <iframe
                    key={refreshKey}
                    srcDoc={code}
                    title="Live Preview"
                    className="w-full h-[60vh] rounded-lg border border-[#2b2b2b] bg-white"
                    scrolling="yes"
                    style={{ overflow: "auto" }}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {fullpreview && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100 shadow">
            <p className="font-bold">Full Preview</p>
            <button
              onClick={() => setFullpreview(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
          <iframe
            srcDoc={code}
            className="w-full h-[calc(100vh-60px)]"
            scrolling="yes"
            style={{ overflow: "auto" }}
            title="Full Preview"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default Home;
