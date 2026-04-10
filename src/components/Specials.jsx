// src/components/Specials.jsx
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const Specials = () => {
  const { RiveComponent } = useRive({
    src: 'ramblers_specials.riv',
    artboard: 'Artboard',
    stateMachines: 'State Machine 1',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover, 
      alignment: Alignment.TopCenter,
    }),
  });

  return (
    <div className="full-screen-rive">
      <RiveComponent />
    </div>
  );
};

export default Specials;