import CoolMenu from "@/components/coolMenu/coolmenu";
import "./globals.css";

const menuData = [
  ["Account", "Spend", "Chart"],
  ["Learn", "Algorithm", "h5c3", "Java", "React", "SQL", "Docker", "git"],
  ["Fun", "Jokes", "Swallow"],
];
export default function Home() {
  return (
    <div className="root-container">
      <div className="menu">
        <CoolMenu menuData={menuData} />
      </div>
    </div>
  );
}
