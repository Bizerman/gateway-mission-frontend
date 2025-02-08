import { FC } from 'react';
import './ElementSearchBar.css';

interface Props {
    value: string;
    setValue: (value: string) => void;
    onSubmit: () => void;
    loading?: boolean;
    placeholder?: string;
    buttonTitle?: string;
}

const ElementSearchBar: FC<Props> = ({ value, setValue, onSubmit, placeholder }) => {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSubmit(); // вызов функции поиска при нажатии Enter
        }
    };

    return (
        <div className="search">
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(event) => setValue(event.target.value)} // обновление значения при вводе
                onKeyDown={handleKeyPress} // обработка нажатия клавиш
            />
        </div>
    );
};

export default ElementSearchBar;
