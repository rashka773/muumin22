// Local bundled audio/images for lessons, keyed by lesson id.
// React Native's require() needs a static, literal path — you can't build
// it dynamically from a string — so each asset gets one line here.
// Any lesson NOT listed here falls back to downloading its audioFile/image
// URL from R2 instead, once that's set up.

export const localAudio: Record<string, number> = {
  "erayo-001": require("../../assets/audio/erayo/erayo-001.m4a"),
};

export const localImages: Record<string, number> = {
  "erayo-001": require("../../assets/images/erayo-001.jpg"),
  "erayo-002": require("../../assets/images/erayo-002.jpg"),
  "erayo-003": require("../../assets/images/erayo-003.jpg"),
  "erayo-004": require("../../assets/images/erayo-004.jpg"),
  "erayo-005": require("../../assets/images/erayo-005.jpg"),
  "erayo-006": require("../../assets/images/erayo-006.jpg"),
  "erayo-007": require("../../assets/images/erayo-007.jpg"),
  "erayo-008": require("../../assets/images/erayo-008.jpg"),
  "erayo-009": require("../../assets/images/erayo-009.jpg"),
  "erayo-010": require("../../assets/images/erayo-010.jpg"),
};