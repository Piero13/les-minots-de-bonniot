import AboutSection from "../components/home/AboutSection";
import EventHighlight from "../components/home/EventHighlight";
import EventsCalendar from "../components/home/EventsCalendar";

const Home = () => {
    return (
        <div>
            <AboutSection />
            <EventHighlight />
            <EventsCalendar />
        </div>
    );
};

export default Home;
