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
import { withScreenLoading } from "./components/withScreenLoading";

const WelcomeScreen = withScreenLoading(Welcome, "auth");
const LoginScreen = withScreenLoading(Login, "auth");
const SignupScreen = withScreenLoading(Signup, "auth");
const DiagnosticScreen = withScreenLoading(Diagnostic, "auth");
const HomeScreen = withScreenLoading(Home, "home");
const MorningGreetingScreen = withScreenLoading(MorningGreeting, "activity");
const BrushScreen = withScreenLoading(Brush, "activity");
const FeedScreen = withScreenLoading(Feed, "activity");
const BathScreen = withScreenLoading(Bath, "activity");
const SleepScreen = withScreenLoading(Sleep, "activity");
const PlayScreen = withScreenLoading(Play, "activity");
const WalkScreen = withScreenLoading(Walk, "activity");
const VetVisitScreen = withScreenLoading(VetVisit, "activity");
const TricksScreen = withScreenLoading(Tricks, "activity");
const StoryTimeScreen = withScreenLoading(StoryTime, "activity");
const PetDiaryScreen = withScreenLoading(PetDiary, "activity");
const PetGardenScreen = withScreenLoading(PetGarden, "activity");
const PetDoctorScreen = withScreenLoading(PetDoctor, "activity");
const InterviewModeScreen = withScreenLoading(InterviewMode, "activity");
const ChallengeModeScreen = withScreenLoading(ChallengeMode, "activity");
const ListenLearnScreen = withScreenLoading(ListenLearn, "activity");
const ProfileScreen = withScreenLoading(Profile, "profile");
const RankingsScreen = withScreenLoading(Rankings, "ranking");
const AddFriendsScreen = withScreenLoading(AddFriends, "ranking");

export const router = createBrowserRouter([
  {
    path: "/",
    Component: WelcomeScreen,
  },
  {
    path: "/login",
    Component: LoginScreen,
  },
  {
    path: "/signup",
    Component: SignupScreen,
  },
  {
    path: "/diagnostic",
    Component: DiagnosticScreen,
  },
  {
    path: "/home",
    Component: HomeScreen,
  },
  {
    path: "/morning-greeting",
    Component: MorningGreetingScreen,
  },
  {
    path: "/brush",
    Component: BrushScreen,
  },
  {
    path: "/feed",
    Component: FeedScreen,
  },
  {
    path: "/bath",
    Component: BathScreen,
  },
  {
    path: "/sleep",
    Component: SleepScreen,
  },
  {
    path: "/play",
    Component: PlayScreen,
  },
  {
    path: "/walk",
    Component: WalkScreen,
  },
  {
    path: "/vet",
    Component: VetVisitScreen,
  },
  {
    path: "/tricks",
    Component: TricksScreen,
  },
  {
    path: "/story",
    Component: StoryTimeScreen,
  },
  {
    path: "/diary",
    Component: PetDiaryScreen,
  },
  {
    path: "/garden",
    Component: PetGardenScreen,
  },
  {
    path: "/doctor",
    Component: PetDoctorScreen,
  },
  {
    path: "/interview",
    Component: InterviewModeScreen,
  },
  {
    path: "/challenge",
    Component: ChallengeModeScreen,
  },
  {
    path: "/listen",
    Component: ListenLearnScreen,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
  {
    path: "/rankings",
    Component: RankingsScreen,
  },
  {
    path: "/rankings/add-friends",
    Component: AddFriendsScreen,
  },
]);