const Card = ({ data }: { data: any }) => {
  return (
    <div className="mx-auto max-w-xl rounded-lg bg-black p-1">
      <div className="flex flex-col rounded-md bg-white">
        <div className="flex flex-1 flex-col justify-between p-6">
          <div className="flex-1 pt-2">
            <blockquote>
              <p className="text-xl font-bold mb-2 text-gray-800">{data?.mood}</p>
              <p className="text-sm text-gray-800">{data?.description}</p>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
