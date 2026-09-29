// Logos and illustrations (the RISHI Lab placeholder, SVGs) must be shown
// whole; photos look best cropped to fill the frame.
export function isContainImage(src: string) {
  return /RISHI_LAB\.png$|\.svg$/i.test(src);
}

export function imageFitClass(src: string) {
  return isContainImage(src) ? "object-contain p-6 sm:p-8" : "object-cover";
}

export function imageFrameBg(src: string) {
  return isContainImage(src) ? "bg-[#f6f4f0]" : "bg-slate-100";
}
