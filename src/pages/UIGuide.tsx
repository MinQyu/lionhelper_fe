import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

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
};

function UIGuide() {
  const [inputValue, setInputValue] = useState('');
  const [checkboxStates, setCheckboxStates] = useState({
    basic: false,
    disabled: false,
    indeterminate: false,
  });

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
              멋쟁이사자처럼 UI 가이드
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

            <p className="text-base">
              일반 본문 텍스트입니다. 멋쟁이사자처럼에서 개발하는 프로젝트에
              사용됩니다.
            </p>
            <p className="text-muted-foreground text-sm">
              작은 텍스트나 부연 설명에 사용하는 텍스트입니다.
            </p>
            <p className="text-muted-foreground text-xs">
              매우 작은 텍스트로 라벨이나 메타 정보에 사용됩니다.
            </p>
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            💡 사용 예시
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Login Form Example */}
            <div className="bg-card rounded-lg border p-6">
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
            </div>

            {/* Action Cards Example */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-semibold">액션 카드</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span>사용자 관리</span>
                  <Button size="sm" variant="outline">
                    보기
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span>데이터 분석</span>
                  <Button size="sm" variant="outline">
                    보기
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span>설정</span>
                  <Button size="sm" variant="outline">
                    보기
                  </Button>
                </div>
              </div>
            </div>
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
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card mt-12 border-t">
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl">🦁</span>
            <span className="font-semibold">멋쟁이사자처럼</span>
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
