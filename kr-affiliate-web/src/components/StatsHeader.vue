<template>
    <div class="stats-header-container">
        <div class="stats-row">
            <div class="stats">
                <div class="stat-label">회원 머니</div>
                <div class="stat-value green">2,289,553</div>
            </div>

            <div class="stats">
                <div class="stat-label">회원 포인트</div>
                <div class="stat-value green">725,006</div>
            </div>

            <div class="stats">
                <div class="stat-label">보유알</div>
                <div class="stat-value blue">9,892,335</div>
            </div>

            <div class="stats">
                <div class="stat-label">보드머니</div>
                <div class="stat-value blue">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">고객문의</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">충전신청(대기)</div>
                <div class="stat-value grey">0 (0)</div>
            </div>

            <div class="stats">
                <div class="stat-label">환전신청(대기)</div>
                <div class="stat-value grey">0 (0)</div>
            </div>

            <div class="stats">
                <div class="stat-label">회원인증</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">경고</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">전체회원</div>
                <div class="stat-value grey">46</div>
            </div>

            <div class="stats">
                <div class="stat-label">현재접속자</div>
                <div class="stat-value grey">2</div>
            </div>
        </div>

        <div class="stats-row">
            <div class="stats">
                <div class="stat-label">충전금액</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">환전금액</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">충환손익</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">수동머니</div>
                <div class="stat-value blue">0 (0)</div>
            </div>

            <div class="stats">
                <div class="stat-label">수동포인트</div>
                <div class="stat-value blue">0 (0)</div>
            </div>

            <div class="stats">
                <div class="stat-label">총손익</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">카지노베팅</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">카지노당첨</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">카지노롤링</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">카지노손익</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">슬롯베팅</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">슬롯당첨</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">슬롯롤링</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">슬롯손익</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">스포츠베팅</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">스포츠당첨</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">스포츠롤링</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">스포츠손익</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">미니게임베팅</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">미니게임당첨</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">미니게임롤링</div>
                <div class="stat-value grey">0</div>
            </div>

            <div class="stats">
                <div class="stat-label">미니게임손익</div>
                <div class="stat-value grey">0</div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.stats-header-container {
    background-color: #fff;
    font-family: 'NanumNeo';
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    padding-left: 40px;
    justify-content: center;

    &::-webkit-scrollbar-track {
        background-color: #d5d5d5;
    }

    &::-webkit-scrollbar {
        height: 3px;
        background-color: #ffffff;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #999999;
    }

    .stats-row {
        display: flex;
        gap: 5px;
    }

    .stats {
        min-width: 100px;
        min-height: 50px;
        border: 1px solid #9e9e9e;
        display: grid;
        grid-template-rows: 1fr 1fr;

        .stat-label,
        .stat-value {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .stat-label {
            color: #9e9e9e;
            font-size: 12px;
            font-weight: 500;
            padding: 5px;
        }

        .stat-value {
            color: #fff;
            text-shadow: 1px 1px 1px #404040;
            font-size: 12px;
            font-weight: 500;
            padding: 5px;
        }

        .green {
            background-color: #4dbd74;
        }

        .blue {
            background-color: #20a8d8;
        }

        .grey {
            background-color: #b0bec5;
        }
    }
}
</style>