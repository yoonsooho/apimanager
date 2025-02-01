"use client";
import { useState, useTransition } from "react";

interface Item {
    id: number;
    name: string;
    description: string;
    category: string;
}

export default function SearchableTable({ items }: { items: Item[] }) {
    const [searchText, setSearchText] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);
    const [isPending, startTransition] = useTransition();

    const handleSearch = (value: string) => {
        // 검색어 입력은 즉시 반영 (높은 우선순위)
        setSearchText(value);

        // 필터링 작업은 낮은 우선순위로 처리
        startTransition(() => {
            const filtered = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(value.toLowerCase()) ||
                    item.description.toLowerCase().includes(value.toLowerCase()) ||
                    item.category.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredItems(filtered);
        });
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="검색어를 입력하세요..."
                    className="w-full px-4 py-2 border rounded-md"
                />
            </div>

            {/* 로딩 표시 */}
            {isPending && <div className="text-gray-500 mb-2">검색 결과 업데이트 중...</div>}

            {/* 결과 테이블 */}
            <div className={isPending ? "opacity-50" : ""}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2">이름</th>
                            <th className="border p-2">설명</th>
                            <th className="border p-2">카테고리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item.id}>
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2">{item.description}</td>
                                <td className="border p-2">{item.category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
