export default function ConfirmModal({ open, track, onConfirm, onCancel }) {
  if (!open || !track) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-80 text-white flex flex-col gap-4">
        {/* Album Cover */}
        <img
          src={track.albumCover}
          alt="Album"
          className="w-24 mx-auto rounded-lg"
        />

        {/* Title + Artist */}
        <h1 className="text-center font-bold text-lg">Add to Queue?</h1>

        <p className="text-center">
          <span className="font-semibold">{track.title}</span>
          <br />
          <span className="text-gray-400">{track.artist}</span>
        </p>

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
