function OfferMessage() {
  return (
    <span className="offer-marquee-message">
      <span className="offer-marquee-copy">
        <strong>A little fun is rolling your way!</strong>
        <span>Discover playful finds and delightful surprises.</span>
      </span>
      <span aria-hidden="true" className="offer-marquee-sparkle">
        ✦
      </span>
    </span>
  );
}

function OfferMarquee() {
  return (
    <aside aria-label="Featured offer" className="offer-marquee">
      <div className="offer-marquee-track">
        <div className="offer-marquee-group">
          <OfferMessage />
        </div>
        <div aria-hidden="true" className="offer-marquee-group">
          <OfferMessage />
        </div>
      </div>
    </aside>
  );
}

export default OfferMarquee;
