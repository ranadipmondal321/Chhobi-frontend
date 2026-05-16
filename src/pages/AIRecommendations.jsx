import { useState } from "react";
import { toast } from "react-hot-toast";
import { getAIRecommendation } from "../lib/AIModel";
import RecommendedMovies from "../components/RecommendedMovies";

const steps = [
  {
    name: "genre",
    label: "What's your favorite genre?",
    options: ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Animation"],
  },
  {
    name: "mood",
    label: "What's your current mood?",
    options: ["Excited", "Relaxed", "Thoughtful", "Scared", "Inspired", "Romantic"],
  },
  {
    name: "decade",
    label: "Preferred decade?",
    options: ["2020s", "2010s", "2000s", "1990s", "Older"],
  },
  {
    name: "language",
    label: "Preferred language?",
    options: ["English", "Korean", "Spanish", "French", "Other"],
  },
  {
    name: "length",
    label: "Preferred movie length?",
    options: ["Short (<90 min)", "Standard (90-120 min)", "Long (>120 min)"],
  },
];

const initialState = steps.reduce((acc, step) => {
  acc[step.name] = "";
  return acc;
}, {});

const AIRecommendations = () => {
  const [inputs, setInputs] = useState(initialState);
  const [step, setStep] = useState(0);
  const [recommendation, setRecommendation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOption = (value) => {
    setInputs({ ...inputs, [steps[step].name]: value });
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // ✅ reset everything to start over
  const handleReset = () => {
    setRecommendation([]);
    setInputs(initialState);
    setStep(0);
  };

  const generateRecommendations = async () => {
    if (!inputs) return toast("Please enter your inputs.");
    setIsLoading(true);

    const userPrompt = `Given the following user inputs:
- Decade: ${inputs.decade}
- Genre: ${inputs.genre}
- Language: ${inputs.language}
- Length: ${inputs.length}
- Mood: ${inputs.mood}

Recommend 10 ${inputs.mood.toLowerCase()} ${inputs.language}-language ${inputs.genre.toLowerCase()} movies released in the ${inputs.decade} with a runtime between ${inputs.length}. Return the list as plain JSON array of movie titles only, No extra text, no explanations, no code blocks, no markdown, just the JSON array.
example:
["Movie Title 1","Movie Title 2","Movie Title 3","Movie Title 4","Movie Title 5","Movie Title 6","Movie Title 7","Movie Title 8","Movie Title 9","Movie Title 10"]`;

    const result = await getAIRecommendation(userPrompt);
    setIsLoading(false);

    if (result) {
      const cleanedResult = result.replace(/```json\n/i, "").replace(/\n```/i, "");
      try {
        const recommendationArray = JSON.parse(cleanedResult);
        setRecommendation(recommendationArray);
      } catch (error) {
        console.log("Error: ", error);
        toast.error("Failed to parse recommendations.");
      }
    } else {
      toast.error("Failed to get recommendations.");
    }
  };

  // Show results page
  if (recommendation && recommendation.length > 0) {
    return <RecommendedMovies movieTitles={recommendation} onReset={handleReset} />;
  }

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818]">
        <div className="w-10 h-10 rounded-full border-4 border-[#333] border-t-[#e50914] animate-spin mb-4" />
        <p className="text-[#888] text-sm">AI is picking your movies...</p>
      </div>
    );
  }

  // Show questionnaire
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] px-6 md:px-16 py-12 text-white">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight drop-shadow-lg">
          AI Movie Picks
        </h1>
        <p className="text-[#888] text-sm">
          Answer a few questions and we'll find the perfect movie for you.
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Progress bar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-2 bg-[#232323] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e50914] transition-all duration-300 rounded-full"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-white text-sm font-semibold shrink-0">
            {step + 1} / {steps.length}
          </span>
        </div>

        {/* Question card */}
        <div className="bg-[#232323] border border-[#333] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            {steps[step].label}
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {steps[step].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOption(opt)}
                className={`py-3 px-4 rounded-xl border-2 transition font-semibold text-sm text-center focus:outline-none active:scale-95 duration-150
                  ${inputs[steps[step].name] === opt
                    ? "bg-[#e50914] border-[#e50914] text-white shadow-lg"
                    : "bg-[#181818] border-[#444] text-white hover:border-[#e50914] hover:bg-[#e50914]/10"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="px-6 py-2 rounded-full font-semibold border-2 border-[#444] text-white bg-[#181818] hover:bg-[#2a2a2a] transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={step === steps.length - 1 ? generateRecommendations : handleNext}
              disabled={!inputs[steps[step].name]}
              className="px-6 py-2 rounded-full font-semibold border-2 border-[#e50914] text-white bg-[#e50914] hover:bg-red-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {step === steps.length - 1 ? "Get My Picks 🎬" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;