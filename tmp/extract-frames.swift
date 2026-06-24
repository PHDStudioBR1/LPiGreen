import AVFoundation
import AppKit

let path = CommandLine.arguments[1]
let outDir = CommandLine.arguments[2]
let url = URL(fileURLWithPath: path)
let asset = AVAsset(url: url)
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero

let duration = CMTimeGetSeconds(asset.duration)
let count = 12
for i in 0..<count {
  let t = duration * Double(i) / Double(count - 1)
  let time = CMTime(seconds: t, preferredTimescale: 600)
  do {
    let cg = try gen.copyCGImage(at: time, actualTime: nil)
    let img = NSImage(cgImage: cg, size: NSSize(width: cg.width, height: cg.height))
    guard let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff), let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.85]) else { continue }
    let out = "\(outDir)/frame_\(String(format: "%02d", i)).jpg"
    FileManager.default.createFile(atPath: out, contents: data)
    print(out)
  } catch {
    fputs("err \(i): \(error)\n", stderr)
  }
}
