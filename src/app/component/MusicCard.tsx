const MusicCard = ({title}:{title:string}) => {
  return (
    <div className="w-[150px] rounded-md border">
      <div className="p-2">
        <h5 className="items-center text-black text-xs text-center font-medium">
          {title}
        </h5>
      </div>
    </div>
  );
};

export default MusicCard;
