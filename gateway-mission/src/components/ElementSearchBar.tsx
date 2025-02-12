import { FC } from 'react';
import './ElementSearchBar.css';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store.ts";
import {setSearchValue} from "../store/slices/GatewayElementsSlice.ts";

interface Props {
    value: string;
    setValue: (value: string) => void;
    onSubmit: () => void;
    loading?: boolean;
    placeholder?: string;
    buttonTitle?: string;
}

const ElementSearchBar: FC<Props> = ({ value, onSubmit, placeholder }) => {
    const dispatch = useDispatch<AppDispatch>();
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSubmit();
        }
    };

    return (
        <div className="search">
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(event => dispatch(setSearchValue(event.target.value)))}
                onKeyDown={handleKeyPress}
            />
        </div>
    );
};

export default ElementSearchBar;
