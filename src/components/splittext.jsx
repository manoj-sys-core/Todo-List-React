import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

const SplitText = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Wait for fonts to load
  useEffect(() => {
    if (document.fonts.status === 'loaded') setFontsLoaded(true);
    else document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  // GSAP animation
  useEffect(() => {
    if (!ref.current || !text || !fontsLoaded) return;

    const el = ref.current;

    // Revert previous SplitText if exists
    if (el._rbsplitInstance) {
      try {
        el._rbsplitInstance.revert();
      } catch (_) {}
      el._rbsplitInstance = null;
    }

    // Create SplitText instance
    const splitInstance = new GSAPSplitText(el, { type: splitType });

    const targets =
      (splitType.includes('chars') && splitInstance.chars) ||
      (splitType.includes('words') && splitInstance.words) ||
      (splitType.includes('lines') && splitInstance.lines) ||
      splitInstance.chars;

    const startPct = (1 - threshold) * 100;
    const start = `top ${startPct}%`;

    const tween = gsap.fromTo(
      targets,
      { ...from },
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: el,
          start,
          once: true
        },
        onComplete: () => onLetterAnimationComplete?.(),
        force3D: true
      }
    );

    el._rbsplitInstance = splitInstance;

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
      try {
        splitInstance.revert();
      } catch (_) {}
      el._rbsplitInstance = null;
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, fontsLoaded, onLetterAnimationComplete]);

  const renderTag = () => {
    const style = {
      textAlign,
      overflow: 'hidden',
      display: 'inline-block',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      willChange: 'transform, opacity'
    };
    const classes = `split-parent ${className}`;

    const Tag = tag;
    return (
      <Tag ref={ref} style={style} className={classes}>
        {text}
      </Tag>
    );
  };

  return renderTag();
};

export default SplitText;
