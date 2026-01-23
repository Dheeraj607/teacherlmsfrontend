"use client";
import "@/app/css/index_style.css"; // using `@` as alias for src

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Package {
  id: number;
  name: string;
  description: string;
  status: string;
  imageName?: string;
  points?: string[];
  pricing?: {
    rate?: number | string;
    discount?: number | string;
    specialPrice?: number | string;
    finalPrice?: number | string;
    fromDate?: string;
    toDate?: string;
  };
}

export default function LandingPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://ec2-15-206-165-29.ap-south-1.compute.amazonaws.com:3000";

  // --- Logic Helpers ---
  const getStatus = (backendStatus: string, fromDate?: string | null, toDate?: string | null) => {
    if (backendStatus.toLowerCase() !== "active") return "Inactive";
    if (!fromDate && !toDate) return "Active";
    const now = new Date();
    const start = fromDate ? new Date(fromDate) : new Date(0);
    const end = toDate ? new Date(toDate) : new Date(8640000000000000);
    return now >= start && now <= end ? "Active" : "Inactive";
  };

  const formatPrice = (price?: number | string | null) => {
    const num = Number(price || 0);
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => window.history.go(1);

    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_URL}/admin-packages`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        console.error("Error fetching packages:", err);
      }
    };

    fetchPackages();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [API_URL]);

  const planColors = ["grape", "sunflower", "grass", "pool", "bittersweet"];

  return (
    <div className="landing-wrapper font-sans">
      {/* --- NAVBAR --- */}
      <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? "scrolled" : ""}`} style={{ zIndex: 1000 }}>
        <div className="container-fluid" style={{ paddingLeft: "7rem" }}>
          <a className="navbar-brand me-4" href="#home">
            {/* ✅ Updated Logo Path */}
            <img src="/images/logo.jpg" alt="Logo" style={{ height: "48px" }} />
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About Us</a></li>
              <li className="nav-item"><a className="nav-link" href="#demo">Demo</a></li>
              <li className="nav-item"><a className="nav-link" href="#pricing">Pricing</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contact Us</a></li>
              <li className="nav-item">
                <button onClick={() => router.push("/login")} className="nav-link border-0 bg-transparent text-uppercase ">Login</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="hero-bg" id="home">
        <div className="container hero-container">
          <div className="hero-center">
            <h1 className="hero-title animate-fade">Build your own <br /> learning community.</h1>
          </div>
          <div className="cta-bottom">
            <div className="cta-card red animate-up delay-1">
              <div className="icon"><i className="bi bi-rocket"></i></div>
              <h6 className="text-start">Start<br />For Free</h6>
            </div>
            <div className="cta-card yellow animate-up delay-2">
              <div className="icon"><i className="bi bi-telephone"></i></div>
              <h6 className="text-start">Book<br />a Call</h6>
            </div>
            <div className="cta-card green animate-up delay-3">
              <div className="icon"><i className="bi bi-display"></i></div>
              <h6 className="text-start">View<br />Demo</h6>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHAT CREATORS BRING --- */}
      <section className="container-fluid lifedigifobs hero-bg">
        <div className="container">
     <h1
  className="text-center"
  style={{ color: "#5444c9", fontWeight: 700, fontSize: "2.9rem" }}
>
  What creators bring to life on Digifobs
</h1>

          <div className="row mt-5">
            {[
              { title: "Courses", img: "cardImg1.jpg" },
              { title: "Workshops", img: "cardImg2.jpg" },
              { title: "Membership", img: "cardImg3.jpg" },
              { title: "Consultation", img: "cardImg4.jpg" },
            ].map((item, i) => (
              <div key={i} className="col-md-3 col-sm-6 mb-4">
                <div className="card h-100">
                  {/* ✅ Updated Path to /images/ */}
                  <img src={`/images/${item.img}`} className="card-img-top" alt={item.title} />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text text-muted small">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    <a href="#" className="fw-bold small" style={{ textDecoration: "underline" }}>READ MORE</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

   {/* --- SMART FEATURES --- */}
<section className="smartfeaturesection container-fluid">
  <div className="container relative">
    <h2
  className="text-white"
  style={{ fontSize: "3rem", fontWeight: 700, lineHeight: 1.2 }}
>
  Smart features<br />that turn ideas<br />into income
</h2>


    <div id="contentSlider" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">

        {/* Slide 1 */}
        <div className="carousel-item active">
          <div className="row g-4">
            <div className="col-md-12">
              <div className="row justify-content-end">
                <div className="col-md-6">
                  <div className="content-box">
                    <div className="boximge">
                      <img src="/images/boxImage1.jpg" className="img-fluid" alt="feature" />
                    </div>
                    <h4>Host workshops that<br />upsell 20% more</h4>
                    <div className="row justify-content-end">
                      <div className="col-md-8">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                          incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                          gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum
                          dolor sit amet, consectetur adipiscing elit.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="carousel-item">
          <div className="row g-4">
            <div className="col-md-12">
              <div className="row justify-content-end">
                <div className="col-md-6">
                  <div className="content-box">
                    <div className="boximge">
                      <img src="/images/boxImage1.jpg" className="img-fluid" alt="feature" />
                    </div>
                    <h4>Host workshops that<br />upsell 20% more</h4>
                    <div className="row justify-content-end">
                      <div className="col-md-8">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                          incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                          gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum
                          dolor sit amet, consectetur adipiscing elit.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#contentSlider"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#contentSlider"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>

    </div>
  </div>
</section>
{/* --- WHY DIGIFOBS --- */}
<section
  className="container-fluid whydigifobsection"
  style={{ background: "#eae8e8", paddingTop: "6rem", paddingBottom: "6rem" }}
>
  <div className="container">
    <h2
      className="text-center"
      style={{ color: "#5444c9", fontWeight: 700, fontSize: "2.9rem", marginBottom: "3rem" }}
    >
      Built for creators, loved by communities
    </h2>

    <div className="row">
      {[
        {
          title: "Save Money and Time",
          icon: "bi-wallet2",
          color: "grape",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          title: "Boost Your Conversions",
          icon: "bi-graph-up",
          color: "bittersweet",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          title: "Global Reach",
          icon: "bi-globe",
          color: "sunflower",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          title: "24/7 Support",
          icon: "bi-headset",
          color: "grass",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          title: "Advanced Analytics",
          icon: "bi-cpu",
          color: "mint",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          title: "Community Tools",
          icon: "bi-people",
          color: "pool",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      ].map((item, i) => (
        <div key={i} className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className={`whycardicon ${item.color}`}>
                <i className={`bi ${item.icon}`}></i>
              </div>
              <h6 className="card-title mb-4">{item.title}</h6>
              <p className="card-text mb-1">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* --- DYNAMIC SUBSCRIPTION PLANS --- */}
      <section className="container-fluid feeplans">
        <div className="container">
          <h1
  className="text-white mb-6"
  style={{ 
    fontWeight: 700,   // extra bold
    fontSize: "2.9rem",  // increased size
   // bigger gap below
  }}
>
  Subscription Plans
</h1>


          <div className="row">
            {packages.length === 0 ? (
              <p className="text-white text-center">Loading plans...</p>
            ) : (
              packages.map((pkg, index) => {
  const isLast = index === 3; // 4th package (Pro)
  const colorClass = isLast ? "" : planColors[index % planColors.length]; // keep others normal
  const cardStyle = isLast ? { backgroundColor: "#9bde71" } : {};
                const originalRate = Number(pkg.pricing?.rate ?? 0);
                const discount = Number(pkg.pricing?.discount ?? 0);
                const specialPrice = pkg.pricing?.specialPrice ? Number(pkg.pricing.specialPrice) : null;
                const finalPrice = specialPrice ?? (discount > 0 ? (originalRate - (originalRate * discount) / 100) : originalRate);
                const status = getStatus(pkg.status, pkg.pricing?.fromDate, pkg.pricing?.toDate);

                return (
                  <div key={pkg.id} className="col-md-3 mb-4">
                  <div className={`card h-100 ${colorClass}`} style={cardStyle}>


                      <div className="card-body">
                        <h4
  className={`text-center display-6 text-${colorClass}`}
  style={{ fontWeight: 400, fontSize: "3rem" }}
>
  {pkg.name}
</h4>

  <h2
  className={`text-center mb-0 ${isLast ? "" : `text-${colorClass}`}`}
  style={{
    fontWeight: 700,
    fontSize: "3rem",
    color: isLast ? "#6728ef" : undefined, // blue for Pro package
  }}
>
  ₹{formatPrice(finalPrice)}
</h2>


                        <p className="mb-4 text-center text-muted small">per user / year</p>
                        
                        <div className="d-grid gap-2 mb-4">
                          <button 
                            onClick={() => {
                              localStorage.setItem("selectedPackage", JSON.stringify({ id: pkg.id, name: pkg.name, price: formatPrice(finalPrice) }));
                              router.push("/registerlogin");
                            }}
                            disabled={status !== "Active"}
                            className={`btn ${status === "Active" ? (colorClass === 'grass' && index === 3 ? 'btn-outline-light' : 'btn-outline-secondary') : 'btn-light disabled'}`}
                          >
                            {status === "Active" ? "Get Started" : "Unavailable"}
                          </button>
                        </div>

                        <ul className="list-unstyled">
                          {pkg.points?.map((point, idx) => (
                            <li key={idx} className="mb-2" style={{ fontSize: "0.9rem" }}>• {point}</li>
                          )) || (
                            <>
                              <li style={{ fontSize: "0.9rem" }}>• Full Course Access</li>
                              <li style={{ fontSize: "0.9rem" }}>• Community Support</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer py-5">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-md-5 mb-4">
              {/* ✅ Updated Path to /images/ */}
              <div className="footerlogo mb-4"><img src="/images/logo.jpg" alt="logo" style={{ height: "40px" }} /></div>
              <p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <div className="sm d-flex gap-3">
                <a href="#"><i className="bi bi-facebook"></i></a>
                <a href="#"><i className="bi bi-instagram"></i></a>
                <a href="#"><i className="bi bi-twitter"></i></a>
                <a href="#"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-6 footerlinks">
                    <h6>Resources</h6>
              <a href="#">Pricing</a>
              <a href="#">Newsletter</a>
              <a href="#">Blog</a>
              <a href="#">Support</a>
              <a href="#">AI Fiesta</a>
              <a href="#">Careers</a>
            </div>
            <div className="col-md-6 footerlinks">
              <h6>Important Links</h6>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Refund Policy</a>
            </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}












// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// interface Package {
//   id: number;
//   name: string;
//   description: string;
//   status: string;
//   imageName?: string;
//   points?: string[];
//   pricing?: {
//     rate?: number | string;
//     discount?: number | string;
//     specialPrice?: number | string;
//     finalPrice?: number | string;
//     fromDate?: string;
//     toDate?: string;
//   };
// }

// export default function PackageListPage() {
//   const [packages, setPackages] = useState<Package[]>([]);
//   const router = useRouter();

//   // ✅ Fallback if env variable is undefined
//   const API_URL =
//     process.env.NEXT_PUBLIC_API_URL ||
//     "http://ec2-15-206-165-29.ap-south-1.compute.amazonaws.com:3000";

//   const getStatus = (backendStatus: string, fromDate?: string | null, toDate?: string | null) => {
//     if (backendStatus.toLowerCase() !== "active") return "Inactive";
//     if (!fromDate && !toDate) return "Active";
//     if (!fromDate || !toDate) return "Inactive";

//     const now = new Date();
//     const start = new Date(fromDate);
//     const end = new Date(toDate);

//     return now >= start && now <= end ? "Active" : "Inactive";
//   };

//   const formatPrice = (price?: number | string | null) => {
//     if (price === null || price === undefined) return "0";
//     const num = Number(price);
//     if (isNaN(num)) return "0";
//     return Number.isInteger(num) ? num.toString() : num.toFixed(2);
//   };

//   const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : "-");


// useEffect(() => {
//   window.history.pushState(null, "", window.location.href);
//   window.history.pushState(null, "", window.location.href);
//   window.onpopstate = function () {
//     window.history.go(1); // Prevent going back
//   };
// }, []);


  
//   useEffect(() => {
//     console.log("API_URL =", API_URL);

//     const fetchPackages = async () => {
//       try {
//         const res = await fetch(`${API_URL}/admin-packages`);
//         if (!res.ok) throw new Error(`Failed to fetch packages: ${res.status}`);
//         const data = await res.json();
//         setPackages(data);
//       } catch (err) {
//         console.error("Error fetching packages:", err);
//       }
//     };

//     fetchPackages();
//   }, [API_URL]);

//   return (
//     <div
//       className="min-h-screen flex flex-col items-center pb-10 font-sans"
//       style={{
//         background: "linear-gradient(to bottom, #13e5da 0%, #464cc8 50%, #9428cc 100%)",
//       }}
//     >
//       {/* Header */}
//       <div className="w-full max-w-9xl px-6 flex items-center justify-between mt-4 mb-8 relative">
//         <div className="w-40 h-24 relative">
//           <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain" />
//         </div>

//         <h1 className="text-8xl font-extrabold text-black text-center absolute left-1/2 transform -translate-x-1/2">
//           Packages
//         </h1>

//         <button
//           onClick={() => router.push("/login")}
//           className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition"
//         >
//           Login
//         </button>
//       </div>

//       {/* Packages Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-9xl px-6">
//         {packages.length === 0 ? (
//           <p className="text-gray-500 text-center col-span-full">No packages available.</p>
//         ) : (
//           packages.map((pkg) => {
//             const imageUrl = pkg.imageName
//               ? `${API_URL}/uploads/adminpackage/${pkg.imageName.replace(/\\/g, "/")}`
//               : "/placeholder.png";

//             const originalRate = Number(pkg.pricing?.rate ?? 0);
//             const discount = Number(pkg.pricing?.discount ?? 0);
//             const specialPriceRaw = pkg.pricing?.specialPrice;

//             const specialPrice =
//               specialPriceRaw !== undefined && specialPriceRaw !== null
//                 ? Number(specialPriceRaw)
//                 : null;

//             const finalPrice =
//               specialPrice !== null
//                 ? specialPrice
//                 : discount > 0
//                 ? +(originalRate - (originalRate * discount) / 100).toFixed(2)
//                 : originalRate;

//             const showStrikeThrough =
//               discount > 0 || (specialPrice !== null && specialPrice < originalRate);
//             const showOfferDates = discount > 0 || specialPrice !== null;
//             const status = getStatus(pkg.status, pkg.pricing?.fromDate, pkg.pricing?.toDate);

//             return (
//               <div key={pkg.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col">
//                 <div className="relative w-full h-72 mb-4 overflow-hidden rounded-xl">
//                   <Image src={imageUrl} alt={pkg.name} fill className="object-cover" unoptimized />
//                 </div>

//                 <h2 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h2>

//                 <div className="flex items-center gap-3 mb-3">
//                   <span className="text-4xl font-bold text-black-10">₹{formatPrice(finalPrice)}</span>
//                   {showStrikeThrough && (
//                     <span className="text-gray-400 line-through text-2xl">
//                       ₹{formatPrice(originalRate)}
//                     </span>
//                   )}
//                   {discount > 0 && specialPrice === null && (
//                     <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded-md">
//                       {discount}% OFF
//                     </span>
//                   )}
//                 </div>

//                 <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

//                 <button
//                   onClick={() => {
//                     localStorage.removeItem("selectedPackage");
//                     localStorage.setItem(
//                       "selectedPackage",
//                       JSON.stringify({ id: pkg.id, name: pkg.name, price: formatPrice(finalPrice) })
//                     );
//                     router.push("/registerlogin");
//                   }}
//                   className={`btn btn-primary mb-4 transition ${
//                     status === "Active" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                   disabled={status !== "Active"}
//                 >
//                   {status === "Active" ? "Purchase" : "Unavailable"}
//                 </button>

//                 {showOfferDates && (pkg.pricing?.fromDate || pkg.pricing?.toDate) && (
//                   <p className="!text-red-600 font-medium text-sm mb-2">
//                     Offer valid from {formatDate(pkg.pricing?.fromDate)} to {formatDate(pkg.pricing?.toDate)}
//                   </p>
//                 )}

//                 {pkg.points && pkg.points.length > 0 && (
//                   <ul className="text-gray-700 text-sm mb-3 space-y-2">
//                     {pkg.points.map((p, idx) => (
//                       <li key={idx} className="flex items-start gap-2">
//                         <span className="text-indigo-600 text-lg leading-5">›</span>
//                         <span>{p}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }




