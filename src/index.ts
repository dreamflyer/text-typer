export class Change {
    from: string;

    "oldRange": {
        "start": number,
        "end": number
    };

    "newRange": {
        "start": number,
        "end": number
    };

    "oldText": string;

    "newText": string;
}

export class TextTyper {
    private items: Change[] = [];
    
    private currentIndex = 0;

    private files: any = {};

    constructor(content: string) {
        var parsed = JSON.parse(content);

        parsed.forEach(item => {
            var change = recordToChange(item);

            this.items.push(change);
        });
        
        this.updateCurrentContent();
    }

    currentContent(filePath): string {
        return this.files[filePath];
    }

    currentContentPath(): string {
        return this.items[this.currentIndex].from;
    }

    hasNext(): boolean {
        return this.currentIndex < this.items.length - 1;
    }
    
    private updateCurrentContent() {
        var filePath = this.currentContentPath();

        var oldContent = this.files[filePath] || "";

        var change = this.items[this.currentIndex];

        var beforeStart = oldContent.substring(0, change.oldRange.start);

        var afterEnd = oldContent.substring(change.oldRange.start + change.oldText.length);
        
        this.files[filePath] = beforeStart + change.newText + afterEnd;
    }
    
    increment(): void {
        if(!this.hasNext()) {
            return;
        }

        this.currentIndex++;

        this.updateCurrentContent();
    }
}

export function generateInitialChange(filePath: string, content:string): Change {
    var i = 0;

    return {
        "from": filePath,
        "oldRange": {
            "start": 0,
            "end": 0
        },
        "newRange": {
            "start": 0,
            "end": content.length
        },
        "oldText": "",
        "newText": content
    };
}

export function recordToChange(record: any[]): Change {
    var i = 0;

    return {
        "from": record[i++],
        "oldRange": {
            "start": record[i++],
            "end": record[i++]
        },
        "newRange": {
            "start": record[i++],
            "end": record[i++]
        },
        "oldText": record[i++],
        "newText": record[i++]
    };
}

export function changeToRecord(change: Change, filePath?: string): any[] {
    var record = [];

    record.push(filePath || change.from);

    record.push(change.oldRange.start);
    record.push(change.oldRange.end);

    record.push(change.newRange.start);
    record.push(change.newRange.end);

    record.push(change.oldText);
    record.push(change.newText);

    return record;
}