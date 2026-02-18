import WatchModelCard from "@/app/features/WatchModelCard";
import {watchModels} from "@/app/lib/watchModel";
import {WatchModelCardProps} from "@/app/types/WatchModelCardTypes";
import {observer} from "mobx-react";

const WatchSeries = observer(() => {

    return (
        <div className="container-padding">
            <div className="flex gap-3">
                {watchModels.map((watchModel: WatchModelCardProps, index) => (
                    <WatchModelCard
                        cardInfo={watchModel}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
});

export default WatchSeries;