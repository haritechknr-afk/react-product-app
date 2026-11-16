function HomeSeaSection({ offset }) {
  return (
    <g transform={`translate(${offset})`}>
      <rect width="1200" height="800" fill="url(#home-sea-gradient)" />
      <path
        d="M0 80Q180 42 360 80T720 80t240 0 240 0v300H0Z"
        fill="url(#home-sea-light)"
      />
      <g className="home-sea-current home-sea-current-back">
        <path
          d="M0 175C100 145 200 205 300 175S500 145 600 175s200 30 300 0 200-30 300 0"
          fill="none"
          stroke="#d7ffff"
          strokeOpacity=".44"
          strokeWidth="5"
        />
        <path
          d="M0 190C100 165 200 215 300 190s200-25 300 0 200 25 300 0 200-25 300 0"
          fill="none"
          stroke="#9de9ef"
          strokeOpacity=".3"
          strokeWidth="12"
        />
      </g>
      <g className="home-sea-current home-sea-current-front">
        <path
          d="M0 330C100 305 200 355 300 330s200-25 300 0 200 25 300 0 200-25 300 0"
          fill="none"
          stroke="#c5f9fa"
          strokeOpacity=".2"
          strokeWidth="4"
        />
        <path
          d="M0 350C100 330 200 370 300 350s200-20 300 0 200 20 300 0 200-20 300 0"
          fill="none"
          stroke="#77d9e1"
          strokeOpacity=".2"
          strokeWidth="9"
        />
      </g>
      <g transform="translate(116 135)">
        <g className="home-animal-fish home-animal-fish-one">
          <g className="home-fish-tail">
            <path
              d="M24 24 2 8q5 16 0 32l22-16Zm-4 0L8 13m12 11L8 35"
              fill="#ffc65a"
              stroke="#99552c"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </g>
          <path
            d="M18 24q18-22 49-10 14 5 21 10-7 7-21 12-31 12-49-12Z"
            fill="#f57b42"
            stroke="#99552c"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path d="M31 17q16-10 34-3" stroke="#ffd99a" strokeWidth="3" />
          <path d="M48 27q9 1 14 8-11 5-17-2Z" fill="#e96345" />
          <circle cx="74" cy="21" r="4" fill="white" />
          <circle cx="75" cy="21" r="2" fill="#17384b" />
          <path d="M46 15q2-11 16-14l-3 15Z" fill="#ffb951" stroke="#99552c" strokeWidth="2" />
        </g>
      </g>
      <g transform="translate(870 225)">
        <g className="home-animal-fish home-animal-fish-two">
          <g className="home-fish-tail home-fish-tail-small">
            <path
              d="M20 18 2 5q4 13 0 26l18-13Zm-3 0L7 9m10 9L7 27"
              fill="#8ce2d2"
              stroke="#145d6d"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </g>
          <path
            d="M15 18q14-17 39-9 10 3 17 9-7 6-17 9-25 8-39-9Z"
            fill="#45c3b4"
            stroke="#145d6d"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path d="M28 12q11-7 25-2" stroke="#c5fff0" strokeWidth="2.5" />
          <circle cx="60" cy="16" r="3.3" fill="white" />
          <circle cx="61" cy="16" r="1.7" fill="#17384b" />
        </g>
      </g>
      <g transform="translate(650 145)">
        <g className="home-animal-turtle">
          <path
            d="M17 25q0-18 25-19t28 19q-4 18-28 18T17 25Z"
            fill="#45a876"
            stroke="#155c57"
            strokeWidth="2.5"
          />
          <path
            d="M23 25q0-14 19-14t21 14q-3 13-21 13T23 25Z"
            fill="#82c96e"
            stroke="#155c57"
            strokeWidth="2"
          />
          <path d="m42 12 1 25m-19-13h39M24 16l9 8-9 8m37-16-9 8 9 8" stroke="#43895e" strokeWidth="1.5" />
          <ellipse cx="76" cy="25" rx="12" ry="9" fill="#62b984" stroke="#155c57" strokeWidth="2" />
          <circle cx="80" cy="22" r="1.6" fill="#17384b" />
          <g className="home-turtle-flippers" fill="#62b984" stroke="#155c57" strokeLinejoin="round" strokeWidth="2">
            <path d="m23 14-9-6q-7 1-3 7l9 5m5 17-8 7q-6 0-3-7l7-7m32 1 8 7q6 0 3-7l-6-6m-2-9 7-7q7 1 3 7l-8 5" />
          </g>
        </g>
      </g>
      <g transform="translate(380 235)">
        <g className="home-animal-jellyfish home-animal-jellyfish-one">
          <path
            d="M3 27a28 28 0 0 1 56 0Z"
            fill="#c69bed"
            stroke="#694caa"
            strokeWidth="2"
          />
          <path d="M10 26q4-8 10 0t10 0 10 0 10 0" fill="none" stroke="#f4dcff" strokeWidth="2.5" />
          <g className="home-jelly-tentacles" fill="none" stroke="#d7aff1" strokeLinecap="round" strokeWidth="3">
            <path d="M13 28q-8 15 0 28m13-28q-4 13 1 24m12-24q8 14 1 27m12-27q12 13 5 23" />
          </g>
          <circle cx="21" cy="17" r="2" fill="#fff" opacity=".8" />
          <circle cx="39" cy="14" r="1.5" fill="#fff" opacity=".8" />
        </g>
      </g>
      <g transform="translate(1010 135)">
        <g className="home-animal-jellyfish home-animal-jellyfish-two">
          <path
            d="M2 23a21 21 0 0 1 42 0Z"
            fill="#f39ac2"
            stroke="#a64d86"
            strokeWidth="2"
          />
          <path d="M8 22q4-6 8 0t8 0 8 0 8 0" fill="none" stroke="#ffe0f0" strokeWidth="2" />
          <g className="home-jelly-tentacles home-jelly-tentacles-small" fill="none" stroke="#f5b8d5" strokeLinecap="round" strokeWidth="2.5">
            <path d="M11 24q-7 12 0 22m10-22q-3 11 1 19m10-19q7 11 1 21m9-21q9 10 4 19" />
          </g>
        </g>
      </g>
      <g className="home-sea-bubbles" fill="#d9ffff" fillOpacity=".75">
        <circle cx="190" cy="375" r="5" />
        <circle cx="205" cy="345" r="3" />
        <circle cx="795" cy="300" r="4" />
        <circle cx="810" cy="275" r="2.5" />
        <circle cx="530" cy="640" r="4" />
        <circle cx="545" cy="615" r="2.5" />
      </g>
      <g
        className="home-sea-grass"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g stroke="#064c4b" strokeOpacity=".72" strokeWidth="8">
          <path d="M95 820q42-150 12-294m9 205q-65-43-72-120 60 17 75 78m-15-51q54-62 52-125-51 25-64 91" />
          <path d="M288 820q-24-128 24-261m-15 176q-57-32-66-102 55 11 76 65m-5-48q45-65 37-118-44 27-51 83" />
          <path d="M1034 820q-44-142 5-291m-2 209q-67-35-81-111 61 10 91 75m-15-55q54-68 44-130-55 27-66 96" />
          <path d="M1160 820q22-115-16-224m11 158q-54-29-63-89 49 9 70 56m-8-44q39-54 34-103-40 22-48 68" />
        </g>
        <g stroke="#58b58d" strokeOpacity=".85" strokeWidth="4">
          <path d="M170 820q-12-111 35-209m-22 146q-42-25-47-75 41 8 59 48m-6-38q35-48 29-88-35 19-43 58" />
          <path d="M940 820q30-112-14-219m10 155q-49-25-58-83 45 9 66 54m-8-41q37-53 29-99-39 22-47 67" />
        </g>
      </g>
    </g>
  );
}

function HomeCharacter() {
  return (
    <svg
      aria-hidden="true"
      className="home-user-character"
      fill="none"
      viewBox="0 0 210 230"
    >
      <g className="home-user-bubbles" fill="#e2ffff">
        <circle cx="158" cy="21" r="5" opacity=".8" />
        <circle cx="174" cy="40" r="3.5" opacity=".72" />
        <circle cx="166" cy="58" r="2.5" opacity=".65" />
      </g>
      <path
        d="M89 151q22-16 46 0l11 25q-32 19-69 0l5-20Z"
        fill="#165c7c"
        stroke="#123f59"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <g className="home-user-kick">
        <path
          d="m93 169-10 24-19 10m45-27 3 25 14 12"
          stroke="#bd7956"
          strokeLinecap="round"
          strokeWidth="11"
        />
        <path
          d="m65 199-17 7q-8 5-1 9l21-1 12-10m54 0 16 11q6 7-2 9l-21-9-10-10"
          fill="#ffb951"
          stroke="#9e552d"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
      </g>
      <path
        d="M87 116q16-14 40-2l12 40q-25 16-57 0l-2-25Z"
        fill="#f3eee1"
        stroke="#aa9b83"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <path d="M103 115v39m12-40 5 41" stroke="#d4cbb9" strokeWidth="2" />
      <g className="home-user-arm-back">
        <path
          d="m88 122-22 15-12-2"
          stroke="#f3eee1"
          strokeLinecap="round"
          strokeWidth="15"
        />
        <path
          d="m56 135-13 7"
          stroke="#bd7956"
          strokeLinecap="round"
          strokeWidth="11"
        />
        <path
          d="m45 138-9-7m10 10-10 1m11 1-7 7"
          stroke="#bd7956"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </g>
      <g className="home-user-arm-front">
        <path
          d="m130 119 20 14"
          stroke="#f3eee1"
          strokeLinecap="round"
          strokeWidth="16"
        />
        <path
          d="m148 131 13-7 3-12q1-5 5-3l2 9 7-4q5-2 5 3l-5 7 6 1q5 2 1 6l-12 10-15 1Z"
          fill="#bd7956"
          stroke="#92563d"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <path
        d="M108 104q13 6 26 0l2 15q-14 8-29 0Z"
        fill="#f3b08a"
        stroke="#ca805c"
        strokeWidth="1.5"
      />
      <circle cx="91" cy="58" r="8" fill="#f3b08a" stroke="#ca805c" strokeWidth="2" />
      <circle cx="149" cy="58" r="8" fill="#f3b08a" stroke="#ca805c" strokeWidth="2" />
      <path
        d="M120 5C103 5 93 18 92 36l-2 27c0 20 12 35 30 43 18-8 30-23 30-43l-2-27C147 18 137 5 120 5Z"
        fill="#f3b08a"
        stroke="#ca805c"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M93 39C91 21 101 7 115 5c16-3 29 7 33 23l1 12c-7-8-15-12-25-12-12 0-22 4-31 11Z"
        fill="#5b4038"
        stroke="#402e2b"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <g className="home-user-eyes" fill="#3c302d">
        <ellipse cx="108" cy="54" rx="3.2" ry="4.3" />
        <ellipse cx="132" cy="54" rx="3.2" ry="4.3" />
        <circle cx="109" cy="52.5" r="1" fill="#fff" />
        <circle cx="133" cy="52.5" r="1" fill="#fff" />
      </g>
      <path
        d="M120 59q-4 7 0 8"
        stroke="#ca805c"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M111 77q9 9 18 0"
        stroke="#8b4e45"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        d="m103 106 17 12-7 6-14-13m35-5-14 12 8 6 11-14"
        fill="#fffdf3"
        stroke="#aa9b83"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M101 129q9 7 19 0"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="2"
        opacity=".75"
      />
    </svg>
  );
}

function Home() {
  return (
    <main className="home-page">
      <svg
        aria-hidden="true"
        className="home-sea-background"
        preserveAspectRatio="none"
        viewBox="0 0 2400 800"
      >
        <defs>
          <linearGradient id="home-sea-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#39b9d0" />
            <stop offset="48%" stopColor="#168bad" />
            <stop offset="100%" stopColor="#075276" />
          </linearGradient>
          <linearGradient id="home-sea-light" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#e4ffff" stopOpacity=".34" />
            <stop offset="100%" stopColor="#e4ffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1200].map((offset) => (
          <HomeSeaSection key={offset} offset={offset} />
        ))}
      </svg>
      <HomeCharacter />
      <section className="home-content">
        <h1>Welcome to Product Management</h1>
        <p>Manage your products efficiently.</p>
      </section>
    </main>
  );
}

export default Home;
