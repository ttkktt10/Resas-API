import React from "react";

interface PrefectureProps {
  prefecture: { prefCode: number; prefName: string };
  handleEventChecked: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PrefectureCheckbox: React.FC<PrefectureProps> = ({
  prefecture,
  handleEventChecked
}) => {
  return (
    <div key={prefecture.prefCode} className="prefecture-checkbox">
      <label>
        <input
          id={"checkbox" + prefecture.prefCode}
          type="checkbox"
          name="prefname"
          value={prefecture.prefName}
          onChange={handleEventChecked}
        />
        {prefecture.prefName}
      </label>
    </div>
  );
};

export default PrefectureCheckbox;
