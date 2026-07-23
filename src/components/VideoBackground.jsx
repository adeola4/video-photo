const VideoBackground = () => (
  <video
    autoPlay
    loop
    muted
    playsInline
    poster="/background.png"
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/background.mp4" type="video/mp4" />
  </video>
)

export default VideoBackground
