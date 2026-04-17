import { createBrowserRouter } from "react-router";
// Screen imports
import Home from "./screens/Home";
import Welcome from "./screens/Welcome";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Diagnostic from "./screens/Diagnostic";
import MorningGreeting from "./screens/MorningGreeting";
import Brush from "./screens/Brush";
import Feed from "./screens/Feed";
import Bath from "./screens/Bath";
import Sleep from "./screens/Sleep";
import Play from "./screens/Play";
import Walk from "./screens/Walk";
import VetVisit from "./screens/VetVisit";
import Tricks from "./screens/Tricks";
import StoryTime from "./screens/StoryTime";
import PetDiary from "./screens/PetDiary";
import PetGarden from "./screens/PetGarden";
import PetDoctor from "./screens/PetDoctor";
import InterviewMode from "./screens/InterviewMode";
import ChallengeMode from "./screens/ChallengeMode";
import ListenLearn from "./screens/ListenLearn";
import Profile from "./screens/Profile";
import Rankings from "./screens/Rankings";
import AddFriends from "./screens/AddFriends";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/diagnostic",
    Component: Diagnostic,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/morning-greeting",
    Component: MorningGreeting,
  },
  {
    path: "/brush",
    Component: Brush,
  },
  {
    path: "/feed",
    Component: Feed,
  },
  {
    path: "/bath",
    Component: Bath,
  },
  {
    path: "/sleep",
    Component: Sleep,
  },
  {
    path: "/play",
    Component: Play,
  },
  {
    path: "/walk",
    Component: Walk,
  },
  {
    path: "/vet",
    Component: VetVisit,
  },
  {
    path: "/tricks",
    Component: Tricks,
  },
  {
    path: "/story",
    Component: StoryTime,
  },
  {
    path: "/diary",
    Component: PetDiary,
  },
  {
    path: "/garden",
    Component: PetGarden,
  },
  {
    path: "/doctor",
    Component: PetDoctor,
  },
  {
    path: "/interview",
    Component: InterviewMode,
  },
  {
    path: "/challenge",
    Component: ChallengeMode,
  },
  {
    path: "/listen",
    Component: ListenLearn,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/rankings",
    Component: Rankings,
  },
  {
    path: "/rankings/add-friends",
    Component: AddFriends,
  },
]);