
import './About.scss';
import Topbar from '../../components/homebody/topbar/Topbar';

export default function About() {
    return (
        <div>
            <Topbar />
            <div className="company">
                <div className="img">
                    <img src="https://raw.githubusercontent.com/pico-india/main-django/main/static/about-team.jpg" alt="" />
                </div>
                <div className="company-info">
                    <span>Siddhant <span className="our">Full Stack Web Developer</span></span>
                    <p>
                        As a <b>Full Stack Web Developer</b>, I builded a foundation in programming and development concepts. I
                        am constantly seeking to expand my knowledge and skills in web development. I have experience in
                        developing dynamic, user-friendly websites using <b>HTML</b>, <b>CSS</b>, <b>JavaScript</b>, and <b>React</b>. I am also
                        proficient in server-side programming languages such as <b>Node.js</b>, and have experience working with
                        databases such as <b>MongoDB</b>.
                    </p>
                </div>
            </div>
        </div>
    );
}
