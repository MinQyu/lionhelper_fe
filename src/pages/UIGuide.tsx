import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';

// 코드 예시들을 별도 상수로 분리 (IDE 하이라이팅 개선)
const CODE_EXAMPLES = {
  button: `import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  클릭하세요
</Button>`,

  input: `import { Input } from '@/components/ui/input';

<Input 
  type="email" 
  placeholder="이메일을 입력하세요"
  onChange={(e) => setValue(e.target.value)}
/>`,

  checkbox: `import { Checkbox } from '@/components/ui/checkbox';

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">
    약관에 동의합니다
  </label>
</div>`,

  radioGroup: `import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <label htmlFor="option1">옵션 1</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <label htmlFor="option2">옵션 2</label>
  </div>
</RadioGroup>`,

  select: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="옵션을 선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">옵션 1</SelectItem>
    <SelectItem value="option2">옵션 2</SelectItem>
    <SelectItem value="option3">옵션 3</SelectItem>
  </SelectContent>
</Select>`,

  card: `import { Card } from '@/components/ui/card';

<Card variant="default">
  <h3 className="text-lg font-semibold mb-2">카드 제목</h3>
  <p className="text-muted-foreground">
    카드 내용이 들어갑니다.
  </p>
</Card>`,

  datePicker: `import { DatePicker } from '@/components/ui/date-picker';

const [date, setDate] = useState<Date | undefined>();

<DatePicker
  date={date}
  onDateChange={setDate}
  placeholder="날짜를 선택하세요"
/>`,

  badge: `import { Badge } from '@/components/ui/badge';

<Badge variant="default">기본</Badge>
<Badge variant="secondary">보조</Badge>
<Badge variant="destructive">삭제</Badge>
<Badge variant="outline">외곽선</Badge>
<Badge variant="success">성공</Badge>
<Badge variant="warning">경고</Badge>
<Badge variant="info">정보</Badge>`,
};

function UIGuide() {
  const [inputValue, setInputValue] = useState('');
  const [checkboxStates, setCheckboxStates] = useState({
    basic: false,
    disabled: false,
    indeterminate: false,
  });
  const [radioValue, setRadioValue] = useState('react');
  const [selectValue, setSelectValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
              <span className="text-primary-foreground text-lg font-bold">
                🦁
              </span>
            </div>
            <h1 className="from-primary bg-gradient-to-r to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
              라이언 헬퍼 UI 가이드
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-12 px-6 py-8">
        {/* Color Palette */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            🎨 컬러 팔레트
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                name: 'Primary',
                class: 'bg-primary',
                text: 'text-primary-foreground',
              },
              {
                name: 'Secondary',
                class: 'bg-secondary',
                text: 'text-secondary-foreground',
              },
              {
                name: 'Accent',
                class: 'bg-accent',
                text: 'text-accent-foreground',
              },
              {
                name: 'Destructive',
                class: 'bg-destructive',
                text: 'text-destructive-foreground',
              },
              {
                name: 'Muted',
                class: 'bg-muted',
                text: 'text-muted-foreground',
              },
              {
                name: 'Background',
                class: 'bg-background border-2',
                text: 'text-foreground',
              },
              {
                name: 'Card',
                class: 'bg-card border-2',
                text: 'text-card-foreground',
              },
              { name: 'Border', class: 'bg-border', text: 'text-foreground' },
            ].map(color => (
              <div
                key={color.name}
                className={`${color.class} ${color.text} rounded-lg p-4 text-center font-medium`}
              >
                {color.name}
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            📖 Typography
          </h2>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1 (4xl)</h1>
            <h2 className="text-3xl font-bold">Heading 2 (3xl)</h2>
            <h3 className="text-2xl font-semibold">Heading 3 (2xl)</h3>
            <h4 className="text-xl font-semibold">Heading 4 (xl)</h4>
            <h5 className="text-lg font-medium">Heading 5 (lg)</h5>
            <h6 className="text-base font-medium">Heading 6 (base)</h6>

            <p className="text-base">일반 본문 텍스트입니다.</p>
            <p className="text-muted-foreground text-sm">
              작은 텍스트나 부연 설명에 사용하는 텍스트입니다.
            </p>
            <p className="text-muted-foreground text-xs">
              매우 작은 텍스트로 라벨이나 메타 정보에 사용됩니다.
            </p>
          </div>
        </section>
        {/* Button Components */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            🔘 Button 컴포넌트
          </h2>

          {/* Button Variants */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">📱</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">States</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button className="opacity-75">Loading...</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Components */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            📝 Input 컴포넌트
          </h2>

          <div className="max-w-md space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Basic Input</h3>
              <Input
                placeholder="기본 입력 필드"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Input Types</h3>
              <div className="space-y-3">
                <Input type="text" placeholder="텍스트 입력" />
                <Input type="email" placeholder="이메일 입력" />
                <Input type="password" placeholder="비밀번호 입력" />
                <Input type="number" placeholder="숫자 입력" />
                <Input type="search" placeholder="검색..." />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Input States</h3>
              <div className="space-y-3">
                <Input placeholder="Normal" />
                <Input placeholder="Disabled" disabled />
                <Input
                  placeholder="Error state"
                  className="border-destructive"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Checkbox Components */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            ☑️ Checkbox 컴포넌트
          </h2>

          <div className="max-w-md space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Basic Checkbox</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="basic-checkbox"
                  checked={checkboxStates.basic}
                  onCheckedChange={checked =>
                    setCheckboxStates(prev => ({
                      ...prev,
                      basic: checked === true,
                    }))
                  }
                />
                <label
                  htmlFor="basic-checkbox"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  기본 체크박스
                </label>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Checkbox States</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="normal" />
                  <label htmlFor="normal" className="text-sm font-medium">
                    Normal
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="checked" defaultChecked />
                  <label htmlFor="checked" className="text-sm font-medium">
                    Checked
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="disabled" disabled />
                  <label
                    htmlFor="disabled"
                    className="text-muted-foreground text-sm font-medium"
                  >
                    Disabled
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="disabled-checked" disabled defaultChecked />
                  <label
                    htmlFor="disabled-checked"
                    className="text-muted-foreground text-sm font-medium"
                  >
                    Disabled & Checked
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Checkbox Group</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="option1" />
                  <label htmlFor="option1" className="text-sm font-medium">
                    React
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="option2" />
                  <label htmlFor="option2" className="text-sm font-medium">
                    Vue
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="option3" />
                  <label htmlFor="option3" className="text-sm font-medium">
                    Angular
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="option4" />
                  <label htmlFor="option4" className="text-sm font-medium">
                    Svelte
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RadioGroup Components */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            🔘 RadioGroup 컴포넌트
          </h2>

          <div className="max-w-md space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Basic RadioGroup</h3>
              <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="react" id="radio-react" />
                  <label
                    htmlFor="radio-react"
                    className="text-sm leading-none font-medium"
                  >
                    React
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vue" id="radio-vue" />
                  <label
                    htmlFor="radio-vue"
                    className="text-sm leading-none font-medium"
                  >
                    Vue
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="angular" id="radio-angular" />
                  <label
                    htmlFor="radio-angular"
                    className="text-sm leading-none font-medium"
                  >
                    Angular
                  </label>
                </div>
              </RadioGroup>
              <p className="text-muted-foreground mt-2 text-sm">
                선택된 값: {radioValue}
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">RadioGroup States</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Normal</h4>
                  <RadioGroup defaultValue="option1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="normal1" />
                      <label htmlFor="normal1" className="text-sm font-medium">
                        옵션 1
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="normal2" />
                      <label htmlFor="normal2" className="text-sm font-medium">
                        옵션 2
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Disabled</h4>
                  <RadioGroup defaultValue="disabled1" disabled>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="disabled1" id="disabled1" />
                      <label
                        htmlFor="disabled1"
                        className="text-muted-foreground text-sm font-medium"
                      >
                        비활성화된 옵션 1
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="disabled2" id="disabled2" />
                      <label
                        htmlFor="disabled2"
                        className="text-muted-foreground text-sm font-medium"
                      >
                        비활성화된 옵션 2
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">서비스 선택</h3>
              <RadioGroup defaultValue="basic">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id="service-basic" />
                  <label
                    htmlFor="service-basic"
                    className="text-sm font-medium"
                  >
                    기본 서비스 (무료)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="service-premium" />
                  <label
                    htmlFor="service-premium"
                    className="text-sm font-medium"
                  >
                    프리미엄 서비스 (월 9,900원)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enterprise" id="service-enterprise" />
                  <label
                    htmlFor="service-enterprise"
                    className="text-sm font-medium"
                  >
                    기업용 서비스 (문의)
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </section>

        {/* Select Components */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            📋 Select 컴포넌트
          </h2>

          <div className="max-w-md space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Basic Select</h3>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="프레임워크를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue.js</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                  <SelectItem value="solid">SolidJS</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground mt-2 text-sm">
                선택된 값: {selectValue || '없음'}
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Grouped Select</h3>
              <Select>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="언어를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>프론트엔드</SelectLabel>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue.js</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>백엔드</SelectLabel>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>데이터베이스</SelectLabel>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Select Sizes</h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Small Size
                  </label>
                  <Select>
                    <SelectTrigger size="sm" className="w-[200px]">
                      <SelectValue placeholder="작은 크기" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">옵션 1</SelectItem>
                      <SelectItem value="option2">옵션 2</SelectItem>
                      <SelectItem value="option3">옵션 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Default Size
                  </label>
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="기본 크기" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">옵션 1</SelectItem>
                      <SelectItem value="option2">옵션 2</SelectItem>
                      <SelectItem value="option3">옵션 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Select States</h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Normal
                  </label>
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="일반 상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">옵션 1</SelectItem>
                      <SelectItem value="option2">옵션 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Disabled
                  </label>
                  <Select disabled>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="비활성화 상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">옵션 1</SelectItem>
                      <SelectItem value="option2">옵션 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">
                멋쟁이사자처럼 지역 선택
              </h3>
              <Select>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="운영 지역을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>수도권</SelectLabel>
                    <SelectItem value="seoul">서울</SelectItem>
                    <SelectItem value="incheon">인천</SelectItem>
                    <SelectItem value="gyeonggi">경기</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>강원권</SelectLabel>
                    <SelectItem value="gangwon">강원</SelectItem>
                    <SelectItem value="chuncheon">춘천</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>충청권</SelectLabel>
                    <SelectItem value="daejeon">대전</SelectItem>
                    <SelectItem value="chungbuk">충북</SelectItem>
                    <SelectItem value="chungnam">충남</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>경상권</SelectLabel>
                    <SelectItem value="busan">부산</SelectItem>
                    <SelectItem value="daegu">대구</SelectItem>
                    <SelectItem value="ulsan">울산</SelectItem>
                    <SelectItem value="gyeongbuk">경북</SelectItem>
                    <SelectItem value="gyeongnam">경남</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>전라권</SelectLabel>
                    <SelectItem value="gwangju">광주</SelectItem>
                    <SelectItem value="jeonbuk">전북</SelectItem>
                    <SelectItem value="jeonnam">전남</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>제주권</SelectLabel>
                    <SelectItem value="jeju">제주</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Card Components */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            🃏 Card 컴포넌트
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Card Variants</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card variant="default">
                  <h4 className="text-lg font-semibold mb-2">Default Card</h4>
                  <p className="text-muted-foreground text-sm">
                    기본 카드 스타일입니다. 가장 일반적으로 사용되는 카드
                    형태입니다.
                  </p>
                </Card>

                <Card variant="bordered">
                  <h4 className="text-lg font-semibold mb-2">Bordered Card</h4>
                  <p className="text-muted-foreground text-sm">
                    더 굵은 테두리를 가진 카드입니다. 강조가 필요한 콘텐츠에
                    적합합니다.
                  </p>
                </Card>

                <Card variant="elevated">
                  <h4 className="text-lg font-semibold mb-2">Elevated Card</h4>
                  <p className="text-muted-foreground text-sm">
                    그림자 효과가 강화된 카드입니다. 떠있는 느낌을 주고 싶을 때
                    사용합니다.
                  </p>
                </Card>

                <Card variant="outlined">
                  <h4 className="text-lg font-semibold mb-2">Outlined Card</h4>
                  <p className="text-muted-foreground text-sm">
                    투명한 배경에 테두리만 있는 카드입니다. 미니멀한 디자인에
                    적합합니다.
                  </p>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Content Cards</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <div className="space-y-3">
                    <div className="bg-primary rounded-lg h-24 flex items-center justify-center">
                      <span className="text-primary-foreground text-2xl">
                        🚀
                      </span>
                    </div>
                    <h4 className="font-semibold">프로젝트 관리</h4>
                    <p className="text-muted-foreground text-sm">
                      효율적인 프로젝트 관리를 위한 도구들을 제공합니다.
                    </p>
                    <Button size="sm" className="w-full">
                      시작하기
                    </Button>
                  </div>
                </Card>

                <Card>
                  <div className="space-y-3">
                    <div className="bg-secondary rounded-lg h-24 flex items-center justify-center">
                      <span className="text-secondary-foreground text-2xl">
                        📊
                      </span>
                    </div>
                    <h4 className="font-semibold">데이터 분석</h4>
                    <p className="text-muted-foreground text-sm">
                      데이터를 시각화하고 인사이트를 얻을 수 있습니다.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      자세히 보기
                    </Button>
                  </div>
                </Card>

                <Card>
                  <div className="space-y-3">
                    <div className="bg-accent rounded-lg h-24 flex items-center justify-center">
                      <span className="text-accent-foreground text-2xl">
                        ⚙️
                      </span>
                    </div>
                    <h4 className="font-semibold">설정 관리</h4>
                    <p className="text-muted-foreground text-sm">
                      시스템 설정을 쉽게 관리하고 커스터마이징할 수 있습니다.
                    </p>
                    <Button size="sm" variant="ghost" className="w-full">
                      설정하기
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Profile Cards</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                      <span className="text-primary-foreground font-semibold">
                        김
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold">김멋사</h4>
                      <p className="text-muted-foreground text-sm">
                        프론트엔드 개발자
                      </p>
                      <p className="text-muted-foreground text-xs">
                        멋쟁이사자처럼 12기
                      </p>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          팔로우
                        </Button>
                        <Button size="sm" variant="ghost">
                          메시지
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">팀 통계</h4>
                      <span className="text-muted-foreground text-sm">
                        이번 주
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">완료된 작업</span>
                        <span className="font-semibold">24개</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">진행 중</span>
                        <span className="font-semibold">8개</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">대기 중</span>
                        <span className="font-semibold">12개</span>
                      </div>
                    </div>
                    <div className="bg-secondary h-2 rounded-full">
                      <div className="bg-primary h-2 w-3/4 rounded-full"></div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Interactive Cards</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">공지사항</h4>
                      <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                        새글
                      </span>
                    </div>
                    <p className="text-sm">
                      멋쟁이사자처럼 12기 최종 발표회가 다음 주에 진행됩니다.
                    </p>
                    <p className="text-muted-foreground text-xs">
                      2024.12.20 | 운영진
                    </p>
                  </div>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">이번 주 과제</h4>
                      <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                        진행중
                      </span>
                    </div>
                    <p className="text-sm">
                      React로 To-Do 애플리케이션을 만들어 제출해주세요.
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">마감: 12/25</span>
                      <span className="text-destructive">3일 남음</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Date Picker Components */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            📅 Date Picker 컴포넌트
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Basic Date Picker</h3>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    기본 날짜 선택
                  </label>
                  <DatePicker
                    date={selectedDate}
                    onDateChange={setSelectedDate}
                    placeholder="날짜를 선택하세요"
                  />
                  {selectedDate && (
                    <p className="text-muted-foreground mt-2 text-sm">
                      선택된 날짜: {selectedDate.toLocaleDateString('ko-KR')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Date Range Selection</h3>
              <div className="max-w-md space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      시작 날짜
                    </label>
                    <DatePicker
                      date={startDate}
                      onDateChange={setStartDate}
                      placeholder="시작 날짜"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      종료 날짜
                    </label>
                    <DatePicker
                      date={endDate}
                      onDateChange={setEndDate}
                      placeholder="종료 날짜"
                      className="w-full"
                    />
                  </div>
                </div>
                {startDate && endDate && (
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm font-medium">선택된 기간:</p>
                    <p className="text-muted-foreground text-sm">
                      {startDate.toLocaleDateString('ko-KR')} ~{' '}
                      {endDate.toLocaleDateString('ko-KR')}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      총{' '}
                      {Math.ceil(
                        (endDate.getTime() - startDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                      일
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Date Picker Variants</h3>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    이벤트 날짜
                  </label>
                  <DatePicker
                    placeholder="이벤트 날짜를 선택하세요"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    생년월일
                  </label>
                  <DatePicker
                    placeholder="생년월일을 선택하세요"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    비활성화된 날짜 선택
                  </label>
                  <DatePicker
                    placeholder="선택할 수 없습니다"
                    disabled
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badge Components */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            🏷️ Badge 컴포넌트
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Badge Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">기본</Badge>
                <Badge variant="secondary">보조</Badge>
                <Badge variant="destructive">삭제</Badge>
                <Badge variant="outline">외곽선</Badge>
                <Badge variant="success">성공</Badge>
                <Badge variant="warning">경고</Badge>
                <Badge variant="info">정보</Badge>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Badge Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge size="sm" variant="default">
                  작은 뱃지
                </Badge>
                <Badge size="default" variant="default">
                  기본 뱃지
                </Badge>
                <Badge size="lg" variant="default">
                  큰 뱃지
                </Badge>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span>상태:</span>
                  <Badge variant="success">활성</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>우선순위:</span>
                  <Badge variant="destructive">높음</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>카테고리:</span>
                  <Badge variant="outline">프론트엔드</Badge>
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>알림:</span>
                  <Badge variant="info">3</Badge>
                  <span>개의 새 메시지</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            💡 사용 예시
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Login Form Example */}
            <Card variant="elevated">
              <h3 className="mb-4 text-lg font-semibold">로그인 폼</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    아이디
                  </label>
                  <Input type="text" placeholder="아이디를 입력하세요" />
                </div>
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    비밀번호
                  </label>
                  <Input type="password" placeholder="비밀번호를 입력하세요" />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">로그인</Button>
                  <Button variant="outline">회원가입</Button>
                </div>
              </div>
            </Card>

            {/* Action Cards Example */}
            <Card>
              <h3 className="mb-4 text-lg font-semibold">대시보드</h3>
              <div className="space-y-3">
                <Card variant="outlined" className="p-3">
                  <div className="flex items-center justify-between">
                    <span>사용자 관리</span>
                    <Button size="sm" variant="outline">
                      보기
                    </Button>
                  </div>
                </Card>
                <Card variant="outlined" className="p-3">
                  <div className="flex items-center justify-between">
                    <span>데이터 분석</span>
                    <Button size="sm" variant="outline">
                      보기
                    </Button>
                  </div>
                </Card>
                <Card variant="outlined" className="p-3">
                  <div className="flex items-center justify-between">
                    <span>설정</span>
                    <Button size="sm" variant="outline">
                      보기
                    </Button>
                  </div>
                </Card>
              </div>
            </Card>

            {/* Settings Form Example */}
            <Card variant="bordered">
              <h3 className="mb-4 text-lg font-semibold">설정</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    알림 설정
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-notifications" />
                      <label htmlFor="email-notifications" className="text-sm">
                        이메일 알림
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="push-notifications" />
                      <label htmlFor="push-notifications" className="text-sm">
                        푸시 알림
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    언어 설정
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="언어 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">설정 저장</Button>
              </div>
            </Card>
            <Card>
              <h4 className="font-semibold mb-3">출장 신청서</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">출장 시작일</label>
                  <DatePicker
                    placeholder="출장 시작일"
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">출장 종료일</label>
                  <DatePicker
                    placeholder="출장 종료일"
                    className="w-full mt-1"
                  />
                </div>
                <Button className="w-full mt-3">신청하기</Button>
              </div>
            </Card>

            <Card>
              <h4 className="font-semibold mb-3">회의실 예약</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">예약 날짜</label>
                  <DatePicker
                    placeholder="회의 날짜 선택"
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">회의실</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="회의실 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room-a">회의실 A</SelectItem>
                      <SelectItem value="room-b">회의실 B</SelectItem>
                      <SelectItem value="room-c">회의실 C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full mt-3">예약하기</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Code Examples */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            💻 코드 예시
          </h2>

          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 text-sm font-semibold">Button 사용법</h3>
              <pre className="text-muted-foreground overflow-x-auto text-xs">
                {CODE_EXAMPLES.button}
              </pre>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 text-sm font-semibold">Input 사용법</h3>
              <pre className="text-muted-foreground overflow-x-auto text-xs">
                {CODE_EXAMPLES.input}
              </pre>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 text-sm font-semibold">Checkbox 사용법</h3>
              <pre className="text-muted-foreground overflow-x-auto text-xs">
                {CODE_EXAMPLES.checkbox}
              </pre>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 text-sm font-semibold">RadioGroup 사용법</h3>
              <pre className="text-muted-foreground overflow-x-auto text-xs">
                {CODE_EXAMPLES.radioGroup}
              </pre>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 text-sm font-semibold">Select 사용법</h3>
              <pre className="text-muted-foreground overflow-x-auto text-xs">
                {CODE_EXAMPLES.select}
              </pre>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 text-sm font-semibold">Card 사용법</h3>
              <pre className="text-muted-foreground overflow-x-auto text-xs">
                {CODE_EXAMPLES.card}
              </pre>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 text-sm font-semibold">Date Picker 사용법</h3>
              <pre className="text-muted-foreground overflow-x-auto text-xs">
                {CODE_EXAMPLES.datePicker}
              </pre>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 text-sm font-semibold">Badge 사용법</h3>
              <pre className="text-muted-foreground overflow-x-auto text-xs">
                {CODE_EXAMPLES.badge}
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card mt-12 border-t">
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl">🦁</span>
            <span className="font-semibold">멋쟁이사자처럼 라이언 헬퍼</span>
          </div>
          <p className="text-muted-foreground text-sm">
            UI 컴포넌트 가이드 • shadcn/ui + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default UIGuide;
