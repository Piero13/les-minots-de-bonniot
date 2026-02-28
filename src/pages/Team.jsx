import TeamGrid from "../components/team/TeamGrid";
import TeamSlider from "../components/team/TeamSlider";

const Team = () => {
  return (
    <div className="py-4 px-3 bg-customLight">
      <TeamGrid />
      <TeamSlider />
    </div>
  );
};

export default Team;
