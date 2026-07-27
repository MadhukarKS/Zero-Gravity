import accExhaust from "@/assets/acc-exhaust.jpg";
import helmetCarbon from "@/assets/helmet-carbon.jpg";
import helmetTouring from "@/assets/helmet-touring.jpg";
import helmetModular from "@/assets/helmet-modular.jpg";
import accGoggles from "@/assets/acc-goggles.jpg";
import accVisor from "@/assets/acc-visor.jpg";
import glovesPro from "@/assets/gloves-pro.jpg";
import glovesCarbon from "@/assets/gloves-carbon.jpg";
import bootsTrack from "@/assets/boots-track.jpg";
import bootsAllweather from "@/assets/boots-allweather.jpg";
import jacketLeather from "@/assets/jacket-leather.jpg";
import jacketMesh from "@/assets/jacket-mesh.jpg";
import jacketRain from "@/assets/jacket-rain.jpg";

export type Accessory = {
  id: string;
  name: string;
  cat: string;
  price: string;
  img: string;
  desc?: string;
};

export const ACCESSORIES: Accessory[] = [
  { id: "zg-carbon-helmet", name: "ZG Carbon Helmet", cat: "Helmets", price: "₹42,000", img: helmetCarbon, desc: "Aerospace-grade carbon shell with anti-fog Pinlock visor." },
  { id: "apex-touring-helmet", name: "Apex Touring Helmet", cat: "Helmets", price: "₹28,500", img: helmetTouring, desc: "Long-haul comfort with integrated sun visor and Bluetooth slot." },
  { id: "modular-flip-helmet", name: "Modular Flip-Up Helmet", cat: "Helmets", price: "₹24,900", img: helmetModular, desc: "Flip-front convenience without compromising safety." },
  { id: "pro-rider-gloves", name: "Pro Rider Gloves", cat: "Gloves", price: "₹7,200", img: glovesPro, desc: "Goat leather palm, knuckle armor, touchscreen tips." },
  { id: "carbon-knuckle-gloves", name: "Carbon Knuckle Gloves", cat: "Gloves", price: "₹9,800", img: glovesCarbon, desc: "Race-spec carbon shell with sliders for track days." },
  { id: "track-riding-boots", name: "Track Riding Boots", cat: "Boots", price: "₹18,400", img: bootsTrack, desc: "TPU shin plate, replaceable toe slider." },
  { id: "all-weather-boots", name: "All-Weather Riding Boots", cat: "Boots", price: "₹15,200", img: bootsAllweather, desc: "Waterproof membrane, oil-resistant sole." },
  { id: "armored-leather-jacket", name: "Armored Leather Jacket", cat: "Jackets", price: "₹34,900", img: jacketLeather, desc: "CE Level-2 armor, perforated leather, removable thermal liner." },
  { id: "mesh-touring-jacket", name: "Mesh Touring Jacket", cat: "Jackets", price: "₹21,500", img: jacketMesh, desc: "Hi-airflow mesh for summer rides with full armor." },
  { id: "rain-shell-jacket", name: "Rain Shell Jacket", cat: "Jackets", price: "₹6,500", img: jacketRain, desc: "Pack-down 10K waterproof shell, hi-vis stripes." },
  { id: "titanium-slipon-exhaust", name: "Titanium Slip-On Exhaust", cat: "Exhausts", price: "₹68,500", img: accExhaust, desc: "Hand-welded titanium, signature ZG growl." },
  { id: "full-system-exhaust", name: "Full System Exhaust", cat: "Exhausts", price: "₹1,12,000", img: accExhaust, desc: "Race-spec headers + collector + can." },
  { id: "kevlar-riding-pants", name: "Kevlar Riding Pants", cat: "Pants", price: "₹16,800", img: jacketLeather, desc: "Kevlar weave with hip and knee armor pockets." },
  { id: "hi-vis-vest", name: "Hi-Vis Reflective Vest", cat: "Safety", price: "₹3,400", img: jacketRain, desc: "360° reflective panels for night riding." },
  { id: "back-protector", name: "CE Back Protector", cat: "Safety", price: "₹8,900", img: jacketLeather, desc: "Level-2 spine armor, breathable mesh harness." },
  { id: "polarized-goggles", name: "Polarized Riding Goggles", cat: "Eyewear", price: "₹4,900", img: accGoggles, desc: "Anti-scratch polarized lens with foam seal." },
  { id: "smoke-visor", name: "Smoke Tinted Visor", cat: "Eyewear", price: "₹2,800", img: accVisor, desc: "Universal-fit replacement smoke visor." },
  { id: "tank-bag", name: "Magnetic Tank Bag", cat: "Luggage", price: "₹6,200", img: accExhaust, desc: "20L expandable, rain cover included." },
  { id: "saddle-panniers", name: "Adventure Saddle Panniers", cat: "Luggage", price: "₹11,800", img: accExhaust, desc: "Heat-resistant, dual-strap quick mount." },
  { id: "chain-lock", name: "Hardened Chain Lock", cat: "Locks", price: "₹3,900", img: accExhaust, desc: "16mm hardened steel, weather-sealed." },
];

export const CATEGORIES = ["All", "Helmets", "Jackets", "Gloves", "Boots", "Exhausts", "Pants", "Safety", "Eyewear", "Luggage", "Locks"] as const;
